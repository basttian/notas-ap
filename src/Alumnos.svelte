<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
 
 /* variables de formulario  */
const db = firebase.firestore();
const user = firebase.auth();
let clase ='';
let alumnos = [];
let nombre = '';
let aulas = [];
let selected;


/* cantidad de registros para la paginacion */
let page = 50;
let countTotal;
let firstReg = null;

  db.collection("alumnos").orderBy('created', 'desc').get().then(res => {
    countTotal = res.size;
    //console.log(res.size)
  })


/* Bloquear btn next-back */
let turnOffBtnAtras = true;
let turnOffBtnSiguiente = false;
let arr=[];
/* Pagination */
let query = (ref) => ref.orderBy('created', 'desc').limit(page);

function nextPage(last) {
  turnOffBtnAtras = false;
	query = (ref) => ref.orderBy('created', 'desc')
			  .startAfter(last['created'])
              .limit(page);
          //console.log(last.ref.id)
          arr.splice(0,0,last.ref.id)
        if (((arr.length*page)+page) > countTotal || ((arr.length*page)+page) === countTotal ){
          turnOffBtnSiguiente = true;
        }
    }

function prevPage(first) {
  turnOffBtnSiguiente = false;
  arr.splice(0, 1);
	query = (ref) => ref.orderBy('created', 'desc')
			  .endBefore(first['created'])
              .limitToLast(page);
        //console.log((arr.length*5)+page)
        if (((arr.length*page)+page) === page ){
          turnOffBtnAtras = true;
        }
  }
/* End Pagination */

/* cargar drop aulas */
db.collection('aulas').orderBy('nombre','asc').onSnapshot(data =>{
    aulas = data.docs
})
/* Agregar alumnos */
const addAlumnos = async(u) => {
    const created =  new Date().getTime()
    const user = u;
    await db.collection('alumnos').add({ created, clase ,nombre, user }).then(resp=>{
    clase = ''
    nombre = ''
    console.log("Alumnos agregado con éxito")
  })
}

/* Search in table */
import {myFunction} from "./table.js";


let data=[];

</script>
 
 <!-- Style tag a -->
<style>
a.disabled {
    pointer-events: none;
    color: #ccc;
}

</style>

<svelte:head>
  <title>Alumnos</title>
</svelte:head>

<div class="uk-section uk-section-primary uk-text-center uk-section-xsmall">
  <div class="uk-container">

    <h1>
      <img src="./img/student.svg" width="70" height="70" uk-svg>
      Alumnos
    </h1>

  </div>
</div>
    <!-- End -->
 

<!-- Start Alumnos -->

<div class="uk-container uk-container-expand uk-margin-top">

<FirebaseApp {firebase} perf analytics>
<User persist={sessionStorage} let:user={user} let:auth={auth} on:user>



<!-- Regilla de  formulario y Buscador -->
<div class="uk-child-width-expand@s uk-text-center" uk-grid>
    <div>
               <!-- Formualrio Alumnos -->
        <form on:submit|preventDefault={()=>{addAlumnos(user.uid)}}>
            <select class="uk-select" id="form-stacked-select" bind:value={clase} on:change="{() => selected = ''}">
            <option value="">Seleccione el aula</option>
                {#each aulas as items}
                    <option value={items.id}>{items.data().nombre}</option>
                {/each}
            </select>
             <div class="uk-margin">
                <input class="uk-input uk-form-width-large" disabled={!clase} type="text" bind:value={nombre} placeholder="Nombre del alumno">
            </div>
            <button class="uk-button uk-button-primary" disabled={!nombre} >AGREGAR</button>
        </form>

    </div>
    <div>
        <!-- Centre -->

    </div>
    <div>
        <!-- Right -->

    </div>
</div>
<hr>
            <!-- Search and btn -->          
<form class="uk-search uk-search-navbar">
    <span uk-search-icon></span>
    <input class="uk-search-input" type="search" on:keyup={myFunction} placeholder="Buscar alumno..." id="buscar">
</form>
               
<hr>

<Collection path={'alumnos'} {query} let:data let:first let:last>

<div slot="loading"><div uk-spinner></div></div>


<div class="uk-overflow-auto">
<table class="uk-table uk-table-striped uk-table-condensed uk-text-nowrap" id="tabla">
<caption>Lista de Alumnos</caption>
    <thead>
    <tr>
        <th class="uk-table-shrink">Aula</th>
        <th class="uk-table-expand">Alumno</th>
        <th class="uk-table-shrink" colspan="2">Opciones</th>
    </tr>
    </thead>
    <tbody>
    {#each data as alumno}
    <tr>
        <td class="uk-table-shrink">
      <div uk-form-custom="target: > * > span:first-child">
        <select bind:value={alumno.clase} on:change="{() => selected = ''}">
            {#each aulas as aula}
                {#if alumno.clase == aula.data().nombre }
                    <option value="{aula.id}" selected >{aula.data().nombre}</option>
                {:else}
                    <option value="{aula.id}" >{aula.data().nombre}</option>
                {/if}
            {/each} 
        </select>
        <button class="uk-button uk-button-default" type="button" tabindex="-1">
            <span></span>
            <span uk-icon="icon: chevron-down"></span>
          </button>
        </div>
        </td>
        <td class="uk-table-expand"><input class="uk-input uk-form-width-large" bind:value={alumno.nombre} type="text" placeholder={alumno.nombre}></td>
        <td><a href="javascript:void(0)" uk-tooltip="title: Editar" on:click={()=>alumno.ref.update({ clase:alumno.clase ,nombre:alumno.nombre }).then(resp=>{
          //console.log("Registro actualizado correctamente")
          UIkit.notification({message: "<span uk-icon='icon: pencil'></span> Registro actualizado.", pos: 'bottom-center', status: 'primary'})
          })} uk-icon="pencil"> </a></td>
        <td><a href="javascript:void(0)" uk-tooltip="title: Eliminar" on:click={()=>alumno.ref.delete().then(resp=>{
          //console.log("Registro eliminado")
          UIkit.notification({message: "<span uk-icon='icon: trash'></span> Registro eliminado.", pos: 'bottom-center', status: 'danger'})
          })} uk-icon="trash"> </a></td>
    </tr>
    {/each}
    </tbody>
</table>
</div>

<ul class="uk-pagination">
    <li><a class={turnOffBtnAtras ? "disabled" : ''} uk-tooltip="title: atras..; pos: bottom" href="javascript:void(0)" on:click={() => prevPage(first) } ><span uk-pagination-previous></span> Atras</a></li>
    <li class="uk-margin-auto-left" ><a class={turnOffBtnSiguiente ? "disabled" : ''} uk-tooltip="title: siguiente..; pos: bottom" href="javascript:void(0)" on:click={() => nextPage(last) } >Siguiente <span uk-pagination-next></span></a></li>
</ul>
</Collection>

</User>
</FirebaseApp>

</div><!-- end container  -->
<div class="uk-grid-match uk-grid-small uk-text-center" uk-grid>
    <div class="uk-width-1-12@m">
        <div class="uk-card uk-card-default uk-card-body"><a href="#" uk-totop uk-scroll> </a></div>
    </div>
</div>