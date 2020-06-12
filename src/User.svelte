<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
 
  const db = firebase.firestore();

let selectedRol='staff';
let scoops=false;
let txtuid;
let txtemail;
let txtname;

import USERDATA from "./UserData.svelte";

</script>


<div class="uk-section uk-section-muted">
    <div class="uk-container">
      <h1>Usuarios</h1>
      <p><span class="uk-label">Importante!!</span> El <code>UID*</code> de usuario debe ser agregado de forma manual.</p>
        <div class="uk-grid-match uk-child-width-1-1@m" uk-grid>


<Collection path={`usuarios`} let:data let:ref={usRef} log query={ (ref) => ref.orderBy('useruid', 'desc') }  >
            <div slot="loading"><div uk-spinner></div></div>

          <div class="uk-form-stacked" >

             <div>
                <div class="uk-margin">
                  <label class="uk-form-label" for="form-stacked-select">Rol de usuario</label>
                  <div class="uk-form-controls">
                      <select class="uk-select"  bind:value={selectedRol} id="form-stacked-select">
                          <option value="admin" >Administrativo</option>
                          <option value="staff" >Personal</option>
                      </select>
                  </div>
              </div>
            </div>

            <div>
                <div class="uk-margin">
                  <div class="uk-form-label">Activo</div>
                  <div class="uk-form-controls">
                      <label><input class="uk-radio" bind:group={scoops} type="radio"  value={true} > Si</label><br>
                      <label><input class="uk-radio" bind:group={scoops} type="radio"  value={false} > No</label>
                  </div>
              </div>
            </div>
           
            <div>
              <div class="uk-margin">
                  <label class="uk-form-label" for="form-uid">UID*</label>
                  <div class="uk-form-controls">
                      <input class="uk-input" bind:value={txtuid} id="form-uid" type="text" placeholder="UID" disabled={!selectedRol}>
                  </div>
              </div>
            </div>

            <div>
              <div class="uk-margin">
                  <label class="uk-form-label" for="form-email">Email*</label>
                  <div class="uk-form-controls">
                      <input class="uk-input" bind:value={txtemail} id="form-email" type="email" placeholder="Email" disabled={!txtuid}>
                  </div>
              </div>
            </div>

            <div>
              <div class="uk-margin">
                  <label class="uk-form-label" for="form-name">Nombre*</label>
                  <div class="uk-form-controls">
                      <input class="uk-input" bind:value={txtname} id="form-name" type="text" placeholder="Nombre" disabled={!txtuid}>
                  </div>
              </div>
            </div>
            <div>
              <div class="uk-margin">
                <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom"
                on:click={(e)=>{
                  let useruid=[]
                          usRef.add({useruid:[selectedRol,txtuid,txtemail,txtname,scoops]}).then(resp=>{
                          UIkit.notification({message: '<span uk-icon="icon: check"></span> Agregado a la lista de usuarios.', status: 'primary', pos: 'top-center'});
                          selectedRol='staff';
                          scoops=false;
                          txtuid='';
                          txtemail='';
                          txtname='';
                          })
                      }}
                disabled={!txtuid} >Nuevo usuario</button>
            </div>
          </div>  
        </div>

        
</Collection>


        </div>
    </div>
</div>



<USERDATA />



<div class="uk-grid-match uk-grid-small uk-text-center" uk-grid>
    <div class="uk-width-1-12@m">
        <div class="uk-card uk-card-default uk-card-body"><a href="#" uk-totop uk-scroll> </a></div>
    </div>
</div>