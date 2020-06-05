<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
  const db = firebase.firestore();

  /* Variables */
  let aD,eD, mD;
  let selectedAula,selectedMateria;

import {calcular, clean} from "./table.js"
async function handleChange(){
  await clean();
}

 /* Print pdf  */
  const Pdf = async (a,m) => {
    var doc = await new jsPDF("p", "pt", "letter");
    doc.autoTable({ html: "#miTabla" });
    doc.save(`${a}${m}.pdf`);
  };

</script>

<svelte:head>
  <title>Lista de notas</title>
  <script src="./js/jspdf.min.js">
  </script>
  <script
    src="./js/jspdf.plugin.autotable.js">
  </script>
</svelte:head>

<div class="uk-section uk-section-primary uk-text-center uk-section-xsmall">
  <div class="uk-container">
    <h1>
      <span uk-icon="icon: file-edit; ratio: 3.5" />
      Lista de Notas
    </h1>
  </div>
</div>
<!-- Body -->
<div class="uk-section uk-text-center uk-section-xsmall">
  <div class="uk-container">
    <div class="uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid>

      <Collection
        path={'aulas'}
        query={ref => ref.orderBy('nombre', 'asc')}
        let:data={aD}
        let:ref={aR}
        on:data={i => (selectedAula = i.detail.data[0].id)}
        log>
        <div slot="loading">
          <div uk-spinner />
        </div>

        <div>
          <select class="uk-select" bind:value={selectedAula}>
            {#each aD as aula}
              <option value={aula.id}>{aula.nombre}</option>
            {/each}
          </select>
        </div>
        <div>
          <Doc path={`aulas/${selectedAula}`} let:data let:ref={aR}>
            <Collection
              path={aR.collection('materias')}
              let:data={mD}
              let:ref={mR}
              on:data={m => (selectedMateria = m.detail.data[0].id)}
              log>
              <div slot="loading">
                <div uk-spinner />
              </div>
              <div class="uk-width-1-1">
                <select class="uk-select" bind:value={selectedMateria} on:change={handleChange} >
                  {#each mD as materia}
                    <option value={materia.id}>{materia.nombre}</option>
                  {/each}
                </select>
              </div>
            </Collection>
          </Doc>
        </div>
        <div>
          <!--  -->
          <button
            uk-icon="file-pdf"
            on:click={() => {Pdf(selectedAula,selectedMateria)}}
            uk-tooltip="title: Descargar PDF; pos: bottom" />
            <button uk-tooltip="title: Promedio; pos: bottom" 
            on:click={calcular} uk-icon="icon: info" />
            
        </div>
      </Collection>
    </div>
  </div>
</div>
<hr class="uk-divider-icon" />
<!-- Table List -->
<div class="uk-section uk-section-muted uk-text-center uk-section-xsmall">
  <div class="uk-container">

    <Collection
      path={`alumnos`}
      query={ref => ref
          .where('clase', '==', `${selectedAula}`)
          .orderBy('nombre', 'asc')}
      let:data
      let:ref={aR}>
      <div slot="loading">
        <div uk-spinner />
      </div>
      <div class="uk-overflow-auto">
        <table class="uk-table uk-table-divider" id="miTabla" >

          <!-- Materia -->
          <Doc
            path={`aulas/${selectedAula}/materias/${selectedMateria}`}
            let:data={onceData}
            >
            <caption>{onceData.nombre}</caption>
            <div slot="loading">
              <div uk-spinner />
            </div>
          </Doc>
          <thead>
            <tr>
              <th class="uk-width-*">Estudiante</th>
              <th class="uk-table-shrink">1º</th>
              <th class="uk-table-shrink">2º</th>
              <th class="uk-table-shrink">3º</th>
              <th class="uk-table-shrink"></th>
            </tr>
          </thead>
          <tbody>

            {#each data as item}
              <tr>
                <td class="uk-align-left">{item.nombre}</td>

                <Collection
                  path={`alumnos/${item.id}/notas`}
                  query={ref => ref.where('materia', '==', `${selectedMateria}`)}
                  let:data={oD}
                  let:ref={oR}
                  >
                  <div slot="loading">
                    <div uk-spinner />
                  </div>
                  {#each oD as item,i}
            
                      <td>{item.nota}</td>
                 
                  {/each}
                </Collection>
                
                  <td><span class="uk-label"></span></td>

              </tr>
            {/each}

          </tbody>
          <tfoot>
            <tr>
              <th class="uk-width-*" colspan="4">Ciclo Lectivo: </th>
            </tr>
            <tr>
              <th class="uk-width-*" colspan="4">Asignatura: </th>
            </tr>
            <tr>
              <th class="uk-width-*" colspan="4">Docente: </th>
            </tr>
          </tfoot>
        </table>
      </div>

    </Collection>

  </div>
</div>
<!-- to-top -->
<div class="uk-grid-match uk-grid-small uk-text-center" uk-grid>
  <div class="uk-width-1-12@m">
    <div class="uk-card uk-card-default uk-card-body">
      <a href="#" uk-totop uk-scroll />
    </div>
  </div>
</div>
