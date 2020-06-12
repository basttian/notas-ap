<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
var db = firebase.firestore();

  import TABLANOTAS from './NotasTabla.svelte'

  /* Deefinir Variables */
  let clases;
  let clase;

  let selectedAlumno = [];
  let selectedMateria = [];
  let alumnos;
  let alumno;
  let materias;
  let materia;
  let a = 0;
  let scoops = 1;

  let selectedAula = [];
  let answer = "";
  let aulasData = [];

var today = new Date();
var year = today.getFullYear();

const addNotas = async (x,y,m,t) => {

let sfRef = await db.collection(`alumnos/${x}/notas/`).where('cicloLectivo','==',year).where('materia','==', m ).where('trimestre','==', t );
sfRef.get().then(collections => {
  collections.forEach(collection => {
      console.log('Found subcollection with id:', collection.id);
      UIkit.notification({message:"<span uk-icon='icon: warning'></span>  Error! Nota almacenada",status: "danger"});
      return;
  });
        if(collections.empty){
          db.collection(`alumnos/${x}/notas/`)
              .add({
                cicloLectivo: new Date().getFullYear(),
                trimestre: t,
                aula: selectedAula,
                materia: m,
                nota: a,
                user: y,
                created: new Date().getTime(),
              })
              .then(resp => {
                a = 0;
                UIkit.notification({
                  message:
                    "<span uk-icon='icon: check'></span> Nota agregada con éxito.",
                  pos: "top-center",
                  status: "primary"
                });
              });
        }
        
});


}



</script>


<svelte:head>
  <title>Notas</title>
</svelte:head>

<div class="uk-section uk-section-primary uk-text-center uk-section-xsmall">
  <div class="uk-container">
    <h1><span uk-icon="icon: file-text; ratio: 3.5"></span> Notas</h1>
  </div>
</div>

<!-- Start 1 -->
<div class="uk-section uk-section-muted">
  <div class="uk-container">



    <div class="uk-child-width-1-2@s" uk-grid>
   
      <div> <!-- Start First section -->

<div class="uk-card uk-card-default uk-card-large uk-card-body">
<div class="uk-card-title"></div>
<div uk-grid>

    <div class="uk-width-1-1">
         <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
            <label><input bind:group={scoops} value={1} class="uk-radio" type="radio"> 1° Trimestre</label>
            <label><input bind:group={scoops} value={2} class="uk-radio" type="radio"> 2° Trimestre</label>
            <label><input bind:group={scoops} value={3} class="uk-radio" type="radio"> 3° Trimestre</label>
        </div>
    </div>


<Collection
  path={'aulas'}
  query={ref => ref.orderBy('nombre', 'asc')}
  let:data={aulasData}
  let:ref={aulasRef}
  log
  on:data={i => (selectedAula = i.detail.data[0].id)}>
     <div slot="loading"><div uk-spinner /></div>
  <div class="uk-width-1-1">
  <select class="uk-select" bind:value={selectedAula} on:change={() => (answer = '')}>
    {#each aulasData as aula}
      <option value={aula.id}>{aula.nombre}</option>
    {/each}
  </select>
  </div>

<!--on:data={m => materia = (m.detail.data[0].id)}-->

<Doc path={`aulas/${selectedAula}`} let:data={claseData} let:ref={claseRef}   let:error={err}>
  <Collection
    path={claseRef.collection('materias')}
    let:data={materias}
    let:ref={materiasRef}
    
    log>
    <div slot="loading">
      <div uk-spinner />
    </div>
    <div class="uk-width-1-1">
      <select class="uk-select" bind:value={materia} on:change={() => (selectedMateria = '')}>
        {#each materias as materia}
          <option value={materia.id}>{materia.nombre}</option>
        {/each}
      </select>
    </div>
    <div slot="fallback">{err}</div>
  </Collection>
</Doc>



   <Collection path={"alumnos"} let:data={alumnos} query={ref=>ref.where("clase","==", `${selectedAula}` ).orderBy('nombre','asc')} let:ref on:data={a => alumno = (a.detail.data)}>
   <div slot="loading"><div uk-spinner></div></div>
	<div class="uk-width-1-1">
   <select class="uk-select" bind:value={alumno} on:change={() => selectedAlumno = ''} >
   {#each alumnos as alumno}
          <option value={alumno.id}>{alumno.nombre}</option>
   {/each}
   </select>
  </div>
  </Collection>

</Collection>

	<div class="uk-width-1-1">
	     <div class="uk-margin">
	          <input class="uk-input" type="number" bind:value={a} min=0 max=10 placeholder="Nota">
	      </div>
	       <div class="uk-margin">
	          <input class="uk-range" type="range"  bind:value={a} min=0 max=10 step="0.5">
	       </div>
	</div>

<User persist={sessionStorage} let:user={user} let:auth={auth} on:user>

<div class="uk-width-1-1">
    <form on:submit|preventDefault={()=>{addNotas(alumno,user.uid,materia,scoops)}}>
        <button class="uk-button uk-button-primary uk-button-large uk-width-1-1" disabled={!a}>Agregar Nota</button>
    </form>
</div>

</User>



</div>
</div>
</div><!-- End First Section -->



<div><!-- Start second section -->
        <div class="uk-card uk-card-default uk-card-large uk-card-body">
          	<div class="uk-card-title"></div>

          <TABLANOTAS alumno={alumno} materia={materia} />

        </div>
</div><!-- End second section -->


</div>
</div>
</div>

