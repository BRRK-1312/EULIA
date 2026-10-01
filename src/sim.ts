// EULIA — one simulation step of the whole brain in WebAssembly.
// Same equations as the JS simStep: Shiu et al. LIF for real neurons (+ weak adaptation),
// synthetic bridge neurons with tonic drive, noise and adaptation; 2-step synaptic delay ring.

// pointers into linear memory, set once by init()
let N: i32, NR: i32;
let pRP: usize, pCOL: usize, pW: usize;                       // real CSR: i32 rowptr, i32 col, i16 w
let pSRP: usize, pSCOL: usize, pSWT: usize, pSGRP: usize;     // synthetic CSR: i32, i32, f32, u8
let pGAIN: usize;                                             // f32[3]
let pV: usize, pG: usize, pB0: usize, pB1: usize, pB2: usize, pREF: usize, pTR: usize, pAD: usize;
let pADDEC: usize, pEXT: usize, pPOI: usize, pISPOI: usize, pGDEC: usize, pRESETG: usize, pADC: usize, pNZ: usize;
let pNT: usize, pSPK: usize, pNTSPK: usize, pFIRED: usize;
let t: i32 = 0;
let rng: u32 = 0x9E3779B9;
let WSYN: f32 = 0.0392857, ADCR: f32 = 0.006, DT: f32 = 0.99004983, GDR: f32 = 0.81873075, ADR: f32 = 0.99750312;

export function init(n: i32, nr: i32, ptrs: usize, seed: u32): void {
  N = n; NR = nr; rng = seed | 1;
  // ptrs: an i32 table written by JS, in this exact order
  pRP = <usize>load<i32>(ptrs); pCOL = <usize>load<i32>(ptrs + 4); pW = <usize>load<i32>(ptrs + 8);
  pSRP = <usize>load<i32>(ptrs + 12); pSCOL = <usize>load<i32>(ptrs + 16); pSWT = <usize>load<i32>(ptrs + 20); pSGRP = <usize>load<i32>(ptrs + 24);
  pGAIN = <usize>load<i32>(ptrs + 28);
  pV = <usize>load<i32>(ptrs + 32); pG = <usize>load<i32>(ptrs + 36); pB0 = <usize>load<i32>(ptrs + 40); pB1 = <usize>load<i32>(ptrs + 44); pB2 = <usize>load<i32>(ptrs + 48);
  pREF = <usize>load<i32>(ptrs + 52); pTR = <usize>load<i32>(ptrs + 56); pAD = <usize>load<i32>(ptrs + 60);
  pADDEC = <usize>load<i32>(ptrs + 64); pEXT = <usize>load<i32>(ptrs + 68); pPOI = <usize>load<i32>(ptrs + 72); pISPOI = <usize>load<i32>(ptrs + 76);
  pGDEC = <usize>load<i32>(ptrs + 80); pRESETG = <usize>load<i32>(ptrs + 84); pADC = <usize>load<i32>(ptrs + 88); pNZ = <usize>load<i32>(ptrs + 92);
  pNT = <usize>load<i32>(ptrs + 96); pSPK = <usize>load<i32>(ptrs + 100); pNTSPK = <usize>load<i32>(ptrs + 104); pFIRED = <usize>load<i32>(ptrs + 108);
}
export function setParams(wsyn: f32, adcr: f32): void { WSYN = wsyn; ADCR = adcr; }
export function getT(): i32 { return t; }

@inline function rand(): f32 {           // xorshift32 → [0,1)
  let x = rng; x ^= x << 13; x ^= x >> 17; x ^= x << 5; rng = x;
  return <f32>(x >>> 8) * (1.0 / 16777216.0);
}

export function step(noise: f32, nsteps: i32): void {
  for (let s = 0; s < nsteps; s++) {
    const m = t % 3;
    const now: usize = m == 0 ? pB0 : (m == 1 ? pB1 : pB2);
    const m2 = (t + 2) % 3;
    const later: usize = m2 == 0 ? pB0 : (m2 == 1 ? pB1 : pB2);
    t++;
    let nf = 0;
    // real neurons
    for (let i = 0; i < NR; i++) {
      const o4: usize = <usize>i << 2;
      const gi0 = load<f32>(pG + o4) + load<f32>(now + o4);
      store<f32>(now + o4, 0);
      store<f32>(pTR + o4, load<f32>(pTR + o4) * DT);
      if (load<u8>(pISPOI + i)) {
        store<f32>(pG + o4, gi0);
        const p = load<f32>(pPOI + o4);
        if (p > 0 && rand() < p * 0.001) { store<i32>(pFIRED + (<usize>nf << 2), i); nf++; }
        continue;
      }
      const rf = load<u8>(pREF + i);
      if (rf > 0) { store<u8>(pREF + i, rf - 1); store<f32>(pG + o4, gi0); continue; }
      let vi = load<f32>(pV + o4);
      let a = load<f32>(pAD + o4);
      if (gi0 == 0 && vi == 0 && a == 0) { store<f32>(pG + o4, 0); continue; }
      if (a != 0) { a *= ADR; if (a < 1e-3) a = 0; store<f32>(pAD + o4, a); }
      if (gi0 < 1e-5 && gi0 > -1e-5 && vi < 1e-5 && vi > -1e-5 && a == 0) { store<f32>(pG + o4, 0); store<f32>(pV + o4, 0); continue; }
      vi += 0.05 * (gi0 - ADCR * a - vi);
      let gi = gi0 * GDR;
      if (vi >= 1) { vi = 0; gi = 0; store<u8>(pREF + i, 2); store<i32>(pFIRED + (<usize>nf << 2), i); nf++; }
      store<f32>(pV + o4, vi); store<f32>(pG + o4, gi);
    }
    // synthetic bridge neurons
    for (let i = NR; i < N; i++) {
      const o4: usize = <usize>i << 2;
      let gi = load<f32>(pG + o4) + load<f32>(now + o4);
      store<f32>(now + o4, 0);
      store<f32>(pTR + o4, load<f32>(pTR + o4) * DT);
      let a = load<f32>(pAD + o4) * load<f32>(pADDEC + o4); store<f32>(pAD + o4, a);
      const rf = load<u8>(pREF + i);
      if (rf > 0) { store<u8>(pREF + i, rf - 1); store<f32>(pG + o4, gi); continue; }
      let vi = load<f32>(pV + o4);
      vi += 0.05 * (gi + load<f32>(pEXT + o4) - load<f32>(pADC + o4) * a - vi) + noise * load<f32>(pNZ + o4) * (rand() * 2 - 1);
      gi *= load<f32>(pGDEC + o4);
      if (vi >= 1) { vi = 0; if (load<u8>(pRESETG + i)) gi = 0; store<u8>(pREF + i, 2); store<i32>(pFIRED + (<usize>nf << 2), i); nf++; }
      store<f32>(pV + o4, vi); store<f32>(pG + o4, gi);
    }
    // deliver spikes (arrive two steps later)
    for (let f = 0; f < nf; f++) {
      const i = load<i32>(pFIRED + (<usize>f << 2));
      const o4: usize = <usize>i << 2;
      store<f32>(pTR + o4, load<f32>(pTR + o4) + 1);
      store<f32>(pAD + o4, load<f32>(pAD + o4) + 1);
      store<u8>(pSPK + i, 1);
      const ntp: usize = pNTSPK + (<usize>load<u8>(pNT + i) << 2);
      store<f32>(ntp, load<f32>(ntp) + 1);
      if (i < NR) {
        const e = load<i32>(pRP + o4 + 4);
        for (let k = load<i32>(pRP + o4); k < e; k++) {
          const tgt: usize = later + (<usize>load<i32>(pCOL + (<usize>k << 2)) << 2);
          store<f32>(tgt, load<f32>(tgt) + <f32>load<i16>(pW + (<usize>k << 1)) * WSYN);
        }
      }
      const se = load<i32>(pSRP + o4 + 4);
      for (let k = load<i32>(pSRP + o4); k < se; k++) {
        const tgt: usize = later + (<usize>load<i32>(pSCOL + (<usize>k << 2)) << 2);
        store<f32>(tgt, load<f32>(tgt) + load<f32>(pSWT + (<usize>k << 2)) * load<f32>(pGAIN + (<usize>load<u8>(pSGRP + k) << 2)));
      }
    }
  }
}
