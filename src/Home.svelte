<script>
  import { FirebaseApp, User, Doc, Collection } from "sveltefire";
  import firebase from "firebase/app";
</script>
<svelte:head>
	<title>Home</title>
</svelte:head>
<FirebaseApp {firebase}>
    <User let:user={user} let:auth={auth} >
<div class="uk-section uk-section-muted">
    <div class="uk-container">

        <div class="uk-grid-match uk-child-width-1-1@m" uk-grid>
            <div>
                <!--l-->
            </div>
            <div>
                <div class="uk-card uk-card-primary uk-width-1-1@m">
                    <div class="uk-card-header">
                        <div class="uk-grid-small uk-flex-middle" uk-grid>
                            <div class="uk-width-auto">
                                <span uk-icon="icon: file-edit; ratio: 3.5"></span>
                            </div>
                            <div class="uk-width-expand">
                                <h3 class="uk-card-title uk-margin-remove-bottom">NOTAS</h3>
                                <p></p>
                            </div>
                        </div>
                    </div>
                    <div class="uk-card-body">
                        Bienvenido. Pongase en contacto con el administrador para comenzar a utilizar el sistema. 
                        <a href="https://api.whatsapp.com/send?phone=542664003830&text=Mi%20e-mail%20{user.email}%20Notas-app." target="_blank"><span uk-icon="icon: whatsapp"></span> Whatsapp</a>
                    </div>
                    <div class="uk-card-footer">
                        
                    </div>
                </div>
            </div>
            <div>
                <!--r-->
            </div>
        </div>

    </div>
</div>
</User>
</FirebaseApp>

<hr class="uk-divider-icon">