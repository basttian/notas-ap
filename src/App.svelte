<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";


 // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA-yOx6yYkcsCSK5kIffXt5_Cue7-ZaLmI",
    authDomain: "notas-app-f5b3d.firebaseapp.com",
    databaseURL: "https://notas-app-f5b3d.firebaseio.com",
    projectId: "notas-app-f5b3d",
    storageBucket: "notas-app-f5b3d.appspot.com",
    messagingSenderId: "989237850176",
    appId: "1:989237850176:web:56ff53f51616ee0338afa5",
    measurementId: "G-VFBBEP14V2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

/* Importss */
import Alumnos from './Alumnos.svelte';
import Materias from './Materias.svelte';
import Seccion from './Seccion.svelte';
import Home from './Home.svelte';
import Notas from './Notas.svelte';
import NotasTodas from './NotasTodas.svelte';
import Usuarios from './User.svelte';

/* Component */
const options = [
		{title: 'Home', component: Home, admin: true, staff: true, status: true },
		{title: 'Alumnos', component: Alumnos, admin: true, staff: false, status: true  },
        {title: 'Materias', component: Materias, admin: true, staff: false, status: true },
        {title: 'Seccion', component: Seccion, admin: true, staff: false, status: true },
        {title: 'Nueva Nota', component: Notas, admin: true, staff: true, status: true},
        {title: 'Lista de Notas', component: NotasTodas, admin: true, staff: true, status: true},
        {title: 'Usuarios', component: Usuarios, admin: true, staff: false, status: true },
    ];

var provider = new firebase.auth.GoogleAuthProvider();

/* component home 0 */
let selected = options[0];

var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
var f =new Date();

let fecha = (f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear());

const Call = (id) => {
//console.log(id)
selected = options[id]
}

const Salir = (user) =>{
    //console.log(user)
    UIkit.modal.confirm('Esta seguro que desea salir de la aplicación...').then(function() {
    //console.log('Confirmed.')
    user.signOut().then(resp => {
    UIkit.notification({message: '<span uk-icon=\'icon: check\'></span> Desconexión satisfactoria.', status: 'primary'});    
    });
    }, function () {
        //console.log('Rejected.')
    });
}


</script>
<svelte:head>
	<title>Home</title>
</svelte:head>

<FirebaseApp {firebase}>
	<User let:user={user} let:auth={auth} >

<div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
<nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">
     <div class="uk-navbar-item uk-logo"><img class="uk-border-circle" width="35" height="35" src={user.photoURL} alt=""></div>
        <div class="uk-navbar-nav uk-width-auto uk-margin-top">
            <div class="uk-width-expand">
                <h4 class="uk-comment-title uk-margin-remove">{user.displayName}</h4>
                <p class="uk-comment-meta uk-margin-remove-top">{user.email}</p>
            </div>
        </div>
    </div>
    <div class="uk-navbar-right uk-margin-right">
         
<div class="uk-inline">
    <span uk-icon="grid"></span>
    <div uk-dropdown="pos: top-right">
<Collection path={`usuarios`} query={ref => ref.where("useruid", "array-contains-any", [user.uid])} let:data={uD} let:ref={uR} log>
        <ul class="uk-nav uk-dropdown-nav">
            <!-- User loop -->
            {#each uD as ready}
                <!-- option loop -->
              {#each options as option,i}
                    {#if user.uid === ready.useruid[1] && option.admin && 'admin' === ready.useruid[0] && option.status === ready.useruid[4] }
                        <li><a href="javascript:void(0)" on:click={()=>{Call(i)}} > <span uk-icon="chevron-double-right"></span> {option.title}</a></li>
                    {:else if user.uid === ready.useruid[1] && option.staff && 'staff' === ready.useruid[0] && option.status === ready.useruid[4] }
                        <li><a href="javascript:void(0)" on:click={()=>{Call(i)}} > <span uk-icon="chevron-double-right"></span> {option.title}</a></li>
                    {/if}
              {/each}
            {/each}
        </ul>
</Collection>
    </div>
    <button uk-tooltip="title: Salir; pos: bottom" on:click={()=>{Salir(auth)}} uk-icon="sign-out"></button>
</div>

    </div>
</nav>
 </div>
            
<!-- Btn Ingreso Google  -->
<div slot="signed-out">
<div class="uk-child-width-1-3@m" uk-grid uk-scrollspy="cls: uk-animation-fade; target: .uk-card; delay: 500; repeat: true">
<div class="uk-position-small uk-position-center uk-overlay uk-overlay-default">
<div class="uk-card uk-card-default uk-width-1-1@m ">
    <div class="uk-card-header"></div>
    <div class="uk-card-body uk-card-hover">
   <div class="uk-grid-small uk-flex-middle" uk-grid>
            <div class="uk-width-auto">
               <span uk-icon="icon: google; ratio: 3.5"></span>
            </div>
            <div class="uk-width-expand">
                <h3 class="uk-card-title uk-margin-remove-bottom"><button class="uk-button uk-button-text" uk-tooltip="title: Ingresar..; pos: bottom"  on:click={() => auth.signInWithPopup(provider)} > Google account.</button></h3>
                <p class="uk-text-meta uk-margin-remove-top"><time datetime="">{fecha}</time></p>
            </div>
        </div>
    </div>
    <div class="uk-card-footer"></div>
</div>
</div>
</div>
</div> 

    <!-- component place -->
  <svelte:component this={selected.component}/>


 </User>
</FirebaseApp>



