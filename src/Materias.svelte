<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
  /* Defino variables */
  let txtMateria;
  let aulas = [];
  let nombre;
  const db = firebase.firestore();

  const AgregarMaterias = async (arr, materia) => {
    //console.log(arr, materia)
    for (let index = 0; index < arr.aulas.length; index++) {
      const element = arr.aulas[index];
      const created = new Date().getTime();
      nombre = materia.txtMateria;
      await db
        .collection(`aulas/${element}/materias/`)
        .add({ created, nombre })
        .then(resp => {
          txtMateria = "";
          aulas = "";
          //console.log("Materia agregada correctamente")
          UIkit.notification({
            message: "<span uk-icon='icon: check'></span> Agregado con éxito.",
            pos: "bottom-center",
            status: "primary"
          });
        });
    }
  };
</script>

<svelte:head>
  <title>Materias</title>
</svelte:head>

<div class="uk-section uk-section-primary uk-text-center uk-section-xsmall">
  <div class="uk-container">
    <h1><span uk-icon="icon: copy; ratio: 3.5"></span> Materias</h1>
  </div>
</div>
<div class="uk-section uk-section-muted uk-section-xsmall">
  <div class="uk-container">
    <!-- 1 -->

    <div class="uk-grid-match uk-child-width-1-3@m" uk-grid>

      <Collection
        path={`/aulas/`}
        on:ref
        query={ref => ref.orderBy('nombre', 'asc')}
        let:data
        let:ref={matRef}
        on:data>
        <div slot="loading">
          <div uk-spinner />
        </div>
        <div>
          <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            {#each data as aula}
              <label>
                <input
                  class="uk-checkbox"
                  type="checkbox"
                  bind:group={aulas}
                  value={aula.id} />
                {aula.nombre}
              </label>
            {/each}
          </div>
        </div>
        <div>
          <div class="uk-margin">
            <input
              class="uk-input"
              type="text"
              bind:value={txtMateria}
              placeholder="Ingrese la materia" />
          </div>
        </div>
        <div>

          <div class="uk-margin">
            <button
              class="uk-button uk-button-primary"
              disabled={!txtMateria}
              on:click={() => {
                AgregarMaterias({ aulas }, { txtMateria });
              }}>
              Ingresar
            </button>
          </div>
        </div>
      </Collection>
    </div>
  </div>
</div>


<div class="uk-section uk-section-muted uk-section-xsmall">
  <div class="uk-container">
    <!-- 2 -->
    <hr class="uk-divider-icon" />
    <Collection path={'aulas'} let:data query={ref => ref.orderBy('nombre', 'asc')}>
      {#each data as aula}
        <Doc path={`aulas/${aula.id}`} let:data={aulaData} let:ref={aulaRef}>
          <Collection
            path={aulaRef.collection('materias')}
            let:data={materias}
            let:ref={materiasRef}
            log>
            <div slot="loading">
              <div uk-spinner />
            </div>
            <div class="uk-grid-match uk-child-width-1-1@m" uk-grid>
              <dl class="uk-description-list uk-description-list-divider">
                <dt class="uk-placeholder" >
                  <span class="uk-label">{aula.nombre}</span>
                </dt>
                {#each materias as materia}
                  <dd>
                    <div class="uk-grid-small" uk-grid>
                        <div class="uk-width-expand" uk-leader="fill: -">
                        {materia.nombre}
                        </div>
                        <div>
                        <button
                            class="uk-float-right"
                            uk-tooltip="title: Eliminar materia..; pos: left"
                            on:click={() => 
                             UIkit.modal.confirm('Esta seguro que desea eliminar este registro!').then(function() {
                                materia.ref.delete().then(()=>{
                                UIkit.notification({message: `<span uk-icon='icon: trash'></span> ${materia.nombre} eliminado éxitosamente.`, pos: 'bottom-center', status: 'primary'})
                                })
                            }, function () {
                                UIkit.notification({message: "<span uk-icon='icon: warning'></span> Operación cancelada.", pos: 'bottom-center', status: 'danger'})
                            })
                            }
                            uk-icon="icon: trash" />
                      </div>
                    </div>
                  </dd>
                {/each}
              </dl>
            </div>
            <div slot="fallback">Unable to display comments...</div>
          </Collection>
        </Doc>
      {/each}
    </Collection>

    <!-- fin 2 -->
  </div>
</div>
<div class="uk-grid-match uk-grid-small uk-text-center" uk-grid>
    <div class="uk-width-1-12@m">
        <div class="uk-card uk-card-default uk-card-body"><a href="#" uk-totop uk-scroll> </a></div>
    </div>
</div>