const MENU = document.querySelector("#menu")
const NAV = document.querySelector("#nav")
const ROUTER = document.querySelector("#ruteo")
const SCREEN_HOME = document.querySelector("#home")
const SCREEN_LOGIN = document.querySelector("#login")

ROUTER.addEventListener("ionRouteDidChange", navegar)

function cerrarMenu() {
    MENU.close();    
}


function navegar(evt) {
    const pantallaDestino = evt.detail.to;
        console.log(pantallaDestino);   
    
}