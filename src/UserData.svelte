<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
  const db = firebase.firestore();

export let arrUsuarios=[];
db.collection(`usuarios`).orderBy('useruid', 'desc').onSnapshot(async data =>{
     arrUsuarios = await data.docs
}) 

  let selectedUpdateRol = [];
  let selectedUpdateStatus = [];

</script>

<!-- Seccion card -->

<div class="uk-container">

<div uk-filter="target: .js-filter">
 <ul class="uk-subnav uk-subnav-pill">
    <li class="uk-active" uk-filter-control><a href="#">Todos los Usuarios</a></li>
    <li uk-filter-control="filter: [data-filter='true']; group: filter"><a href="#">Usuarios Activos</a></li>
    <li uk-filter-control="filter: [data-filter='false']; group: filter"><a href="#">Usuarios No Activos</a></li>
    <li uk-filter-control="filter: [data-rol='admin']; group: rol"><a uk-tooltip="title: Adminitrativos" href="#" uk-icon="icon: user"></a></li>
    <li uk-filter-control="filter: [data-rol='staff']; group: rol"><a uk-tooltip="title: Personal" href="#" uk-icon="icon: users"></a></li>
</ul>


<div class="js-filter uk-child-width-1-2@s uk-grid-match" uk-grid>
    

    {#each arrUsuarios as item, index}
      <Doc
          path={`usuarios/${item.id}`}
          let:data={uD}
          let:ref={uR}
          log
        >
      <div slot="loading"><div uk-spinner></div></div>
    <div data-filter={uD.useruid[4]} data-rol={uD.useruid[0]}>
        <div class="uk-card uk-card-primary uk-card-hover uk-width-1-1@m">
        <div class="uk-card-header">
            <div class="uk-card-badge uk-label">
            {#if uD.useruid[4]}
              Usuario {uD.useruid[0]} activo
            {:else}
              Usuario {uD.useruid[0]} No Activo
            {/if}
          </div>
        </div>
        <div class="uk-card-body">
  <div class="uk-form-horizontal uk-margin-large">

    <div class="uk-margin">
        <label class="uk-form-label" for="form-horizontal-rol">Estado.</label>
        <div class="uk-form-controls">
            <select class="uk-select uk-form-blank" bind:value={selectedUpdateStatus[index]}>
                {#if uD.useruid[4]}
                  <option value={true} selected={true} > Si</option>
                  <option value={false} > No</option>
                {:else}
                  <option value={true} > Si</option>
                  <option value={false} selected={true} > No</option>
                {/if}
                
                
            </select>
        </div>
    </div>

    <div class="uk-margin">
        <label class="uk-form-label" for="form-horizontal-rol">Rol de usuario.</label>
        <div class="uk-form-controls">
            <select class="uk-select uk-form-blank" bind:value={selectedUpdateRol[index]} >
                <option value="admin" selected={uD.useruid[0] === 'admin'} >Administrativo</option>
                <option value="staff" selected={uD.useruid[0] === 'staff'} >Personal</option>
            </select>
        </div>
    </div>

    <div class="uk-margin">
        <label class="uk-form-label" for="uidtxt">UID</label>
        <div class="uk-form-controls">
            <input class="uk-input uk-form-blank" value={uD.useruid[1]} type="text" placeholder={uD.useruid[1]} disabled>
        </div>
    </div>

    <div class="uk-margin">
        <label class="uk-form-label" for="emailtxt">Email</label>
        <div class="uk-form-controls">
            <input  class="uk-input uk-form-blank"  value={uD.useruid[2]} type="text" placeholder={uD.useruid[2]} disabled>
        </div>
    </div>


    <div class="uk-margin">
        <label class="uk-form-label" for="nametxt">Nombre</label>
        <div class="uk-form-controls">
            <input class="uk-input uk-form-blank"  value={uD.useruid[3]} type="text" placeholder={uD.useruid[3]} disabled>
        </div>
    </div>


  </div>
            </div>
            <div class="uk-card-footer">
              <button class="uk-button uk-button-text"
              on:click={()=>
                
                uR.update({ useruid:[
                  selectedUpdateRol[index],
                  uD.useruid[1],
                  uD.useruid[2],
                  uD.useruid[3],
                  selectedUpdateStatus[index]
                ] 

              }).then(resp=>{
                  UIkit.notification({message: `<span uk-icon='icon: pencil'></span> Registro actualizado con éxito.`, pos: 'top-center', status: 'primary'})
                      })
                    }
              >Actualizar Usuario
              </button> | 
              <button class="uk-button uk-button-text" 
              on:click={() => 
                    UIkit.modal.confirm('Esta seguro que desea eliminar este usuario?').then(function() {
                         uR.delete().then(()=>{
                        UIkit.notification({message: `<span uk-icon='icon: trash'></span> Registro eliminado éxitosamente.`, pos: 'top-center', status: 'primary'})
                        })
                    }, function () {
                        UIkit.notification({message: "<span uk-icon='icon: warning'></span> Operación cancelada.", pos: 'top-center', status: 'danger'})
                    })
                    }
              > Eliminar Usuario
              </button>
            </div>
        </div>
    </div>
 
      </Doc>

    {/each}


</div>
</div><!-- filter -->
</div>