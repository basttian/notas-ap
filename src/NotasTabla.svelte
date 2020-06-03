<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
  const db = firebase.firestore();


export let alumno;
export let materia;

</script>


  <Doc path={`alumnos/${alumno}`} let:data={alumnos} let:ref={alumnosRef}>
    <div slot="loading">
      <div uk-spinner />
    </div>

    <Collection
      path={alumnosRef.collection('notas')}
      query={ref => ref.where('materia', '==', `${materia}`).orderBy('trimestre','asc')}
      let:data
      let:ref
      on:data
      on:ref
      log>

      <div slot="loading">
        <div uk-spinner />
      </div>

      <div class="uk-overflow-auto">
        <table
          class="uk-table uk-table-striped uk-table-condensed uk-text-nowrap">
          <caption />
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Trimestre</th>
              <th>Nota</th>
              <th>Op</th>
            </tr>
          </thead>
          <tbody>
            {#each data as nota}
              <tr>
                <td>
                  {new Date(nota.created).toLocaleString('es-ar', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </td>
                <td>{nota.trimestre}° Trimestre</td>
                <td>{nota.nota}</td>
                <td>
                  <button
                    uk-icon="icon: close"
                    uk-tooltip="Eliminar.."
                    on:click={() => nota.ref.delete()
                    .then(resp=>{
                          UIkit.notification({
                            message:
                                "<span uk-icon='icon: check'></span> Nota eliminada con éxito.",
                            pos: "top-center",
                            status: "danger"
                            });
                        })
                    } />
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </Collection>
  </Doc>

