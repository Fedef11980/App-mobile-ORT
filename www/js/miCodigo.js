// Variables de estado
let usuarioLogueado = null;
let actividades = [];
let misActividades = [];

const MENU = document.querySelector("#menu");
const NAV = document.querySelector("#nav");
const ROUTER = document.querySelector("#ruteo");
const SCREEN_HOME = document.querySelector("#home");
const SCREEN_LOGIN = document.querySelector("#login");
const SCREEN_MIS_REGISTROS = document.querySelector("#misRegistros");
const SCREEN_REGISTRO_ACTIVIDAD = document.querySelector("#registroNuevo");

inicializar();

function inicializar() {
  suscripcionAEventos();
}

function suscripcionAEventos() {
  // Mis Registros
  document
    .querySelector("#misRegistros")
    .addEventListener("click", misRegistrosHandler);
  // Registro Actividad
  document
    .querySelector("#registroNuevo")
    .addEventListener("click", registroActividadHandler);
  // Ruteo
  ROUTER.addEventListener("ionRouteDidChange", navegar);
}

function cerrarMenu() {
  MENU.close();
}

function actualizarMenu() {
  ocultarOpcionesMenu();
  if (usuarioLogueado) {
    document.querySelector("#btnLogout").style.display = "block";
    document.querySelector("#btnMisRegistros").style.display = "block";
    document.querySelector("#btnRegistroActividad").style.display = "block";
    document.querySelector("#btnMapaUsuarios").style.display = "block";
  }
}

function ocultarOpcionesMenu() {
  document.querySelector("#btnLogout").style.display = "none";
  document.querySelector("#btnMisRegistros").style.display = "none";
  document.querySelector("#btnRegistroActividad").style.display = "none";
  document.querySelector("#btnMapaUsuarios").style.display = "none";
}

function navegar(evt) {
  const rutaDestino = evt.detail.to;
  actualizarMenu();

  if (rutaDestino == "/") {
    verificarInicio();
  } else if (rutaDestino == "/login") {
    mostrarPantallaLogin();
  } else if (rutaDestino == "/registro-actividades") {
    mostrarPantallaRegistroActividad();
  } else if (rutaDestino == "/actividades") {
    mostrarPantallaMisRegistros();
  }
}

function verificarInicio() {
  if (usuarioLogueado) {
    NAV.setRoot("page-home");
  } else {
    NAV.setRoot("page-login");
  }
}
function ocultarPantallas() {
  SCREEN_LOGIN.style.display = "none";
  SCREEN_MIS_REGISTROS.style.display = "none";
  SCREEN_REGISTRO_ACTIVIDAD.style.display = "none";
  SCREEN_HOME.style.display = "none";
}

function mostrarPantallaLogin() {
  ocultarPantallas();
  SCREEN_LOGIN.style.display = "block";
}

function mostrarPantallaRegistroActividad() {
  ocultarPantallas();
  SCREEN_REGISTRO_ACTIVIDAD.style.display = "block";
}

function mostrarPantallaMisRegistros() {
  ocultarPantallas();
  SCREEN_MIS_REGISTROS.style.display = "block";
}

/* Logout */
function cerrarSesion() {
  cerrarMenu();
  localStorage.clear();
  usuarioLogueado = null;
  NAV.setRoot("page-login");
}

function cerrarSesionPorFaltaDeToken() {
  mostrarToast("ERROR", "No autorizado", "Se ha cerrado sesión por seguridad.");
  cerrarSesion();
}

function registroActividadHandler() {
  mostrarPantallaRegistroActividad();
}

function misRegistrosHandler() {
  mostrarPantallaMisRegistros();
}
