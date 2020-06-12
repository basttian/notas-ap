<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";


/* Deefinir Variables */
let nuevaAula;
let idAula;

</script>

<svelte:head>
	<title>Sección</title>
</svelte:head>


<!-- Encabezado -->
<div class="uk-section uk-section-primary uk-text-center uk-section-xsmall">
    <div class="uk-container">
        <h1><span uk-icon="icon: album; ratio: 3.5" /> Sección </h1>
    </div>
</div>
<div class="uk-section uk-section-muted">
    <div class="uk-container">
    

<!-- Boton agregar -->
<div class="btn-flotante">
    <a href="javascript:void(0)" uk-toggle="target: #my-id" uk-icon="icon: plus; ratio: 2"> </a>
</div> 

<!-- Inicia Coleccion seccion -->
<Collection 
path={"aulas"} let:data let:ref on:ref 
query={ (ref) => ref.orderBy('nombre','asc') } 
>

<div slot="loading"><div uk-spinner></div></div>
<div class="uk-child-width-1-1 uk-child-width-1-3@s uk-grid-match uk-grid-small" uk-grid>   

{#each data as aula, index}
    <div>
        <div class="uk-card uk-card-hover uk-card-primary uk-card-body">
                <a href="javascript:void(0)"  class="uk-float-right" uk-icon="more-vertical"> </a>
                <div uk-drop="pos: bottom-justify; animation: uk-animation-slide-top-small; duration: 1000">
                    <ul class="uk-list uk-link-text">
                        <!-- btn Editar -->
                        <li><a uk-tooltip="title: Editar;pos: left" href="javascript:void(0)" uk-icon="pencil"
                        on:click={()=>{
                            aula.ref.update({
                            nombre: `${aula.nombre}`,
                            updatedAt : new Date().getTime(),
                            }).then(resp=>{
                                UIkit.notification({message: `<span uk-icon='icon: pencil'></span> Registro actualizado con éxito.`, pos: 'bottom-center', status: 'primary'})
                            })
                        }    
                        }> </a> </li>
                        <!-- btn Eliminar -->
                        <li><a uk-tooltip="title: Eliminar;pos: left" href="javascript:void(0)" uk-icon="trash"
                        on:click={()=>{
                            UIkit.modal.confirm('Esta seguro que desea eliminar este registro!').then(function() {
                                aula.ref.delete().then(()=>{
                                UIkit.notification({message: `<span uk-icon='icon: trash'></span> ${aula.nombre} eliminado éxitosamente.`, pos: 'bottom-center', status: 'primary'})
                                })
                            }, function () {
                                UIkit.notification({message: "<span uk-icon='icon: warning'></span> Operación cancelada.", pos: 'bottom-center', status: 'danger'})
                            });
                        }  
                        }> </a></li>
                    </ul>
                </div>
                <div class="uk-card-footer">
                    <input class="uk-input uk-form-blank uk-form-expand" bind:value={aula.nombre} type="text">
                </div>
        </div>
    </div>
{/each}
</div>

  <!-- This is the modal Add-->
<div id="my-id" uk-modal>
    <div class="uk-modal-dialog">
    <div class="uk-modal-body">
        <button class="uk-modal-close-outside" type="button" uk-close></button>
            <div class="uk-margin">
                <div class="uk-inline">
                    <input class="uk-input uk-form-width-large" bind:value={nuevaAula} type="text" placeholder="Agregar nuevo" required>
                    <button class="uk-form-icon uk-form-icon-flip" on:click={()=> { 
                        ref.add( {
                            nombre: `${nuevaAula}`,
                            createdAt : new Date().getTime(),
                            }).then((resp)=>{
                            UIkit.modal('#my-id').hide().then(()=>{
                            UIkit.notification({message: "<span uk-icon='icon: check'></span> Agregado con éxito.", pos: 'bottom-center', status: 'primary'})
                            nuevaAula = "";
                            });
                            })
                        }} uk-icon="icon: check" disabled={!nuevaAula} > </button>
                </div>
            </div>
    </div>
    </div>
</div>

<!-- Shown on error or if nothing loads after maxWait time-->
<div slot="fallback">No data found..</div>

</Collection>

    </div>
</div>        

