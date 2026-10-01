# EULIA

**Euli-garun baten mugimenduen behaketa** · *Observación de los movimientos de un cerebro de mosca* · *Observation of the movements of a fly brain*

B_RR_K_ · https://brrk-1312.github.io/EULIA/

Walter Marchettiren *Observación de los movimientos de una mosca sobre el cristal de una ventana desde las 8 de la mañana hasta las 7 de la tarde de un día de mayo de 1967* lanari omenaldia. Hemen euliak ez du gorputzik: benetako euli-garun bat da, osorik simulatua, leiho-kristal batean ibiltzen, garbitzen eta hegan egiten.

---

## EU

- **Garuna:** FlyWire v783 konektoma osoa, 138.639 neurona eta 15.091.983 konexio (54,5 milioi sinapsi), Shiu et al. 2024ko LIF ereduarekin, egokitzapen ahul batekin (τ 400 ms).
- **Benetakoa:** ihesa (LC4/LPLC2 → DNp01 zuntz erraldoia), garbiketa (JO → aBN1), ikusten duenera biratzea eta ibiltzea (LC10 → DNa02, LC9 → DNp09).
- **Sintetikoa:** leihoko ingurunea (noizbehinka pasatzen den itzala, antenetan pilatzen den hautsa), hegaldia (aireratzeak, ibilbidea), ibiltzeko oinarrizko gogoa eta gorantz joateko joera. Erretinaren kodeketa eredu sinplifikatua da.
- **Idazkera:** Marchettirena. Marra etena euliaren bidea da, puntua geldialdia eta berdez haren iraupena (behatzailearen erlojuan). Euliak hegan egiten duenean marra eten egiten da.
- Ez dago elkarrekintzarik: begiratu besterik ez. Kartelaren neurria aukera daiteke; PNG gisa gorde daiteke.

## ES

- **Cerebro:** el conectoma completo FlyWire v783, con 138.639 neuronas y 15.091.983 conexiones (54,5 millones de sinapsis), simulado con el modelo LIF de Shiu et al. 2024 y una adaptación débil (τ 400 ms).
- **Real:** la huida (LC4/LPLC2 → fibra gigante DNp01), el acicalado (JO → aBN1), y girar y caminar hacia lo que ve (LC10 → DNa02, LC9 → DNp09).
- **Sintético:** el entorno de la ventana (una sombra que pasa de vez en cuando, polvo que se acumula en las antenas), el vuelo (despegues y trayectoria), las ganas básicas de caminar y la tendencia a subir. La codificación de la retina es un modelo simplificado.
- **Notación:** la de Marchetti. El trazo discontinuo es el recorrido, el punto es una parada y en verde va su duración, medida con el reloj del observador. Cuando la mosca vuela, el trazo se interrumpe.
- No hay interacción: solo mirar. Se puede elegir el tamaño del cartel y guardarlo como PNG.

## EN

- **Brain:** the whole FlyWire v783 connectome, with 138,639 neurons and 15,091,983 connections (54.5 million synapses), run with the Shiu et al. 2024 LIF model plus a weak adaptation (τ 400 ms).
- **Real:** escape (LC4/LPLC2 → DNp01 giant fibre), grooming (JO → aBN1), and turning and walking toward what it sees (LC10 → DNa02, LC9 → DNp09).
- **Synthetic:** the window surroundings (a shadow passing now and then, dust building up on the antennae), flight (take-offs and flight path), the basic urge to walk and the tendency to climb. The retina encoding is a simplified model.
- **Notation:** Marchetti's. The dashed line is the path, a dot marks a pause and the green figure is its length on the observer's clock. When the fly flies, the line breaks.
- No interaction: you just watch. You can pick the poster size and save it as a PNG.

---

## Fitxategiak · Archivos · Files

| | |
|---|---|
| `index.html` | Orri osoa · la página completa · the whole page |
| `brain.0.txt` … `brain.3.txt` | Konektoma (gzip, base64, 4 zati) · conectoma · connectome |

Nabigatzaile moderno bat behar da (`DecompressionStream`, WebAssembly), eta ~200 MB memoria. Garun osoa WebAssembly-n exekutatzen da, denbora errealetik gertu (egoera-barrak ×1 inguru erakusten du; WebAssembly ez badago, JavaScript-era itzultzen da).

## Kredituak · Créditos · Credits

- Datuak / Datos / Data: **FlyWire v783** — Dorkenwald et al. 2024, *Nature* 634; Schlegel et al. 2024, *Nature* 634. CC BY 4.0.
- Eredua eta neurona-zerrendak / Modelo / Model: **Shiu et al. 2024**, *A Drosophila computational brain model reveals sensorimotor processing*, *Nature* 634 — [philshiu/Drosophila_brain_model](https://github.com/philshiu/Drosophila_brain_model).
- Anotazioak / Anotaciones / Annotations: [flyconnectome/flywire_annotations](https://github.com/flyconnectome/flywire_annotations).
- Omenaldia / Homenaje / Homage: Walter Marchetti, *Observación de los movimientos de una mosca…* (1967).
