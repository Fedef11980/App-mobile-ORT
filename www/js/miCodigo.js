//Variables y constantes
let usuarioLogueado = null;
let actividades = [];

const apiBaseURL = "https://movetrack.develotion.com/";

let map = null;
//DOM
const HOME = document.querySelector("#home"); //definir Home
const MENU = document.querySelector("#menu");
const NAV = document.querySelector("#nav");
const ROUTER = document.querySelector("#ruteo");
const SCREEN_LOGIN = document.querySelector("#login");
const SCREEN_REG_USUARIOS = document.querySelector("#regUsuario");
const SCREEN_REG_ACTIVIDADES = document.querySelector("#regActividades");
const SCREEN_VER_ACTIVIDADES = document.querySelector("#verActividades");
const SCREEN_DETALLE = document.querySelector("#verDetalleActividad");
const VER_USUARIOS = document.querySelector("#verUsuarios");
const COMBO_FILTRO_ACTIVIDADES = document.querySelector("#selectorActividad");

//Inicialización del sistema
inicializar();

function inicializar() {
  subscripcionEventos();
}

function actualizarUsuarioLogueadoDesdeLS() {
  let usuarioRecuperado = localStorage.getItem("UsuarioLogueadoApp"); //nos devuelve un texto
  if (usuarioRecuperado) usuarioLogueado = usuarioRecuperado; //parseo para ver el objeto que se guardo en el localStorage
}

function subscripcionEventos() {
  //Routeo
  ROUTER.addEventListener("ionRouteDidChange", navegar);
  //Login
  document.querySelector("#btnLoginUsuario").addEventListener("click", btnLoginSesionHandler);
  //RegistroUsuario
  document.querySelector("#btnRegistroUsuario").addEventListener("click", btnRegistroUsuarioHandler);
    // Actividades
 COMBO_FILTRO_ACTIVIDADES.addEventListener("ionChange", comboActividadesChangeHandler);
  //Registrar Actividad
  document.querySelector("#btnRegistrarActividad").addEventListener("click", registrarActividad);
  //Detalle Actividad
  document.querySelector("#btnDetalleActividadVolver").addEventListener("click", btnDetalleActividadVolverHandler);
}

function cerrarMenu() {
  MENU.close();
}

function navegar(evt) {
  actualizarUsuarioLogueadoDesdeLS();
  actualizarMenu();
  const pantallaDestino = evt.detail.to;
  switch (pantallaDestino) {
    case "/":
      verificarInicio();
      break;
    case "/login":
      mostrarPantallaLogin();
      break;
    case "/regUsuario":
      mostrarPantallaRegistroUsuario();
      break;
    case "/regActividades":
      mostrarPantallaRegistroActividades();
      break;
    case "/verActividades":
      mostrarPantallaActividades();
      break;
    case "/verDetalle":
      mostrarPantallaDetalleActividad();
      break;
    case "/verUsuarios":
      mostrarMapaUsuarios();
      break;
  }
}

//Funciones de pantallas
function mostrarPantallaLogin() {
  ocultarPantallas();
  SCREEN_LOGIN.style.display = "block";
}

function mostrarPantallaRegistroUsuario() {
  ocultarPantallas();
  SCREEN_REG_USUARIOS.style.display = "block";
}

function mostrarPantallaRegistroActividades() {
  ocultarPantallas();
  //cargarSelectorActividades(comboParaActualizar);
  SCREEN_REG_ACTIVIDADES.style.display = "block";
}

function mostrarPantallaActividades() {
  ocultarPantallas();
  cargarYListarActividades(COMBO_FILTRO_ACTIVIDADES);
  SCREEN_VER_ACTIVIDADES.style.display = "block";
}

function mostrarPantallaDetalleActividad() {
  ocultarPantallas();
  SCREEN_DETALLE.style.display = "block";
}

function actualizarMenu() {
  document.querySelector("#btnMenuLogin").style.display = "none";
  document.querySelector("#btnMenuRegistro").style.display = "none";
  document.querySelector("#btnMenuRegActividades").style.display = "none";
  document.querySelector("#btnMenuCerrarSesion").style.display = "none";
  document.querySelector("#btnMenuVerActividades").style.display = "none";
  document.querySelector("#btnMenuVerUsuarios").style.display = "none";

  if (usuarioLogueado) {
    document.querySelector("#btnMenuRegActividades").style.display = "block";
    document.querySelector("#btnMenuCerrarSesion").style.display = "block";
    document.querySelector("#btnMenuVerActividades").style.display = "block";
    document.querySelector("#btnMenuVerUsuarios").style.display = "block";
  } else {
    document.querySelector("#btnMenuLogin").style.display = "block";
    document.querySelector("#btnMenuRegistro").style.display = "block";
  }
}

function verificarInicio() {
  if (usuarioLogueado) {
    NAV.setRoot("page-verActividades");
    NAV.popToRoot();
  } else {
    NAV.setRoot("page-login");
    NAV.popToRoot();
  }
}

function ocultarPantallas() {
  HOME.style.display = "none";
  SCREEN_LOGIN.style.display = "none";
  SCREEN_REG_USUARIOS.style.display = "none";
  SCREEN_REG_ACTIVIDADES.style.display = "none";
  SCREEN_VER_ACTIVIDADES.style.display = "none";
  VER_USUARIOS.style.display = "none";
  SCREEN_DETALLE.style.display = "none";
}

function cerrarSesion() {
  cerrarMenu();
  usuarioLogueado = null;
  localStorage.clear();
  NAV.setRoot("page-login");
  NAV.popToRoot();
}

//Mapas
function mostrarMapaUsuarios() {
  ocultarPantallas();
  VER_USUARIOS.style.display = "block";
  inicializarMapa();
}

function inicializarMapa() {
  if (!map) {
    map = L.map("miMapa").setView([51.505, -0.09], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    L.marker([51.5, -0.09]).addTo(map).bindPopup("Hola!").openPopup();
  }
}

function btnDetalleActividadVolverHandler() {
  NAV.pop();
}

/*function actualizarUI() {
    if(usuarioLogueado){
      mostrarInicio();
    } else {
      mostrarIngreso();
    }
    actualizarMenu();
  }*/

//Registro de usuarios
function btnRegistroUsuarioHandler() {
  let usuarioIngresado = document.querySelector("#txtNombreRegistro").value;
  let passwordIngresado = document.querySelector("#txtPasswoedIngresado").value;
  let paisIngresado = document.querySelector("#txtPaisIngresado").value;

  document.querySelector("#pRegistro").innerHTML = "";

  if (usuarioIngresado && passwordIngresado && paisIngresado) {
    //llamamos a la API
    const urlAPI = apiBaseURL + "usuarios.php";
    const bodyDeSolicitud = {
      //variables con los datos de los usuarios
      usuario: usuarioIngresado,
      password: passwordIngresado,
      pais: paisIngresado,
    };
    fetch(urlAPI, {
      //llamada http
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyDeSolicitud),
    })
      .then((respuestaDeApi) => {
        // nos entereamos de la promesa cuando se resuelve
        if (respuestaDeApi.status === 200) {
          borrarDatos();
          document.querySelector("#pRegistro").innerHTML =
            "Usuario correctamente registrado, puede iniciar sesión";
        } else {
          document.querySelector("#pRegistro").innerHTML =
            "Ha ocurrido un error, intente más tarde";
        }
        return respuestaDeApi.json();
      })
      .then((respuestaBody) => {
        if (respuestaBody.mensaje)
          document.querySelector("#pRegistro").innerHTML =
            respuestaBody.mensaje;
      })
      .catch((mensaje) => console.log(mensaje));
  } else {
    document.querySelector("#pRegistro").innerHTML =
      "Todos los campos son obligatorios";
  }
}

//user:movetrack
//pass: movetrack
function btnLoginSesionHandler() {
  let loginUser = document.querySelector("#txtLoginMail").value;
  let loginPassword = document.querySelector("#txtLoginPassword").value;
  document.querySelector("#pLogin").innerHTML = "";

  if (loginUser && loginPassword) {
    const urlAPI = apiBaseURL + "login.php";
    const usuarioLogin = {
      usuario: loginUser,
      password: loginPassword,
    };

    fetch(urlAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioLogin),
    })
      .then((respuestaLogin) => {
        if (respuestaLogin.status !== 200)
          document.querySelector("#pLogin").innerHTML =
            "Ha ocurrido un error, intente nuevamente";
        return respuestaLogin.json();
      })
      .then((respuestaBody) => {
        if (respuestaBody.apiKey) {
          borrarDatos();
          usuarioLogueado = Usuario.parse(respuestaBody);
          localStorage.setItem(
            "UsuarioLogueadoApp",
            JSON.stringify(usuarioLogueado)
          ); //Queda en el localSorage el UsuarioLogueadoAPP
          NAV.setRoot("page-verActividades");
          NAV.popToRoot();
        } else if (respuestaBody.mensaje)
          document.querySelector("#pLogin").innerHTML = respuestaBody.mensaje;
      })
      .catch((mensaje) => console.log(mensaje));
  } else {
    mostrarToast(
      "ERROR",
      "Datos incompletos",
      "Todos los campos son obligatorios"
    );
  }
}

//Ver Registros de Actividades
function cargarYListarActividades() {
  actividades = [];
  document.querySelector("#divAct").innerHTML = "";
  const usuarioLogueadoVerActividad = JSON.parse(
    localStorage.getItem("UsuarioLogueadoApp")
  );

  const urlAPI = apiBaseURL + "actividades.php";

  fetch(urlAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: usuarioLogueadoVerActividad.apiKey,
      iduser: usuarioLogueadoVerActividad.id,
    },
  })
    .then((respuestaAPI) => {
      if (respuestaAPI.status === 401) cerrarSesionPorFaltaDeToken();
      else return respuestaAPI.json();
    })
    .then((respuestaBody) => {
      if (respuestaBody.mensaje) {
        mostrarToast("ERROR", "Error", respuestaBody.mensaje);
      } else if (respuestaBody.actividades.length > 0) {
        respuestaBody.actividades.forEach((a) => {
          actividades.push(Actividad.parse(a));
        });
        listarRegistros()
      } else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }      
    })
    .catch((mensaje) => console.log(mensaje));
}

function listarRegistros() {
  let listadoDeRegistros = "<ion-list>";
  actividades.forEach((a) => {
    console.log(a.getURLImagen());
    if (actividades.length === 0) {
      listadoDeRegistros = `<p>No se encontraron actividades.</p>`;
    } else {
      listadoDeRegistros += `
                 <ion-item class="ion-item-producto">
                <ion-thumbnail slot="start">
                    <img src="${a.getURLImagen()}" width="100"/>
                </ion-thumbnail>
                <ion-label>                    
                    <h2>${a.nombre}</h2>                    
                </ion-label>
                <ion-icon name="search-sharp" style="padding:15px;" ></ion-icon>               
                <ion-icon name="trash-sharp" actividad-id="${
                  a.id
                }"></ion-icon>              
                  </ion-item>                  
                  `;
    }
  });
  listadoDeRegistros += "</ion-list>";
  document.querySelector("#divAct").innerHTML = listadoDeRegistros;
  const botonesTraidosHTML = document.querySelectorAll(
    ".btnVerDetalleActividad"
  );
  if (botonesTraidosHTML?.length > 0) {
    botonesTraidosHTML.forEach((b) => {
      b.addEventListener("click", verDetalleActividad);
    });
  }
}

function verDetalleActividad() {
  const idActividadDetalle = this.getAttribute("actividad-id");
}

//TODO listado de actividades
function cargarSelectorActividades(comboParaActualizar) {
  actividades = [];
  const usuarioLogueadoVerActividad = JSON.parse(
    localStorage.getItem("UsuarioLogueadoApp")
  );
  const urlAPI = apiBaseURL + "actividades.php";
  fetch(urlAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: usuarioLogueadoVerActividad.apiKey,
      iduser: usuarioLogueadoVerActividad.id,
    },
  })
    .then((respuestaAPI) => {
      if (respuestaAPI.status === 401) cerrarSesionPorFaltaDeToken();
      else return respuestaAPI.json();
    })
    .then((respuestaBody) => {
      console.log(respuestaBody);
      
      if (respuestaBody.mensaje) {
        mostrarToast("ERROR", "Error", respuestaBody.mensaje);
      } else if (respuestaBody.actividades.length > 0) {
        respuestaBody.actividades.forEach((a) => {
          actividades.push(Actividad.parse(a));
        });
        actualizarComboActividades(comboParaActualizar)
      } else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }
      console.log(respuestaBody);
    })
    .catch((mensaje) => console.log(mensaje));
}

function actualizarComboActividades(comboParaActualizar) {
  comboParaActualizar.innerHTML = "";
  for (let i = 0; i < actividades.length; i++) {
      const actividadActual = actividades[i];
      comboParaActualizar.innerHTML += `<ion-select-option value="${actividadActual.id}">${actividadActual.nombre}</ion-select-option>`;
  }
}

function comboActividadesChangeHandler(evt) {
  const acti = obtenerActividadPorId(evt.detail.value);
  console.log(acti);
  //const nombre = acti.nombre;
  
}

function obtenerActividadPorId(id) {
  let act = null;
  let i = 0;
  while (!act && i < actividades.length) {
    const actividadesActual = actividades[i];    
    if (actividadesActual.id === id) {
      act = actividadesActual;
    }    
    i++;    
  }   
  return act;
}



function registrarActividad() {
  cargarSelectorActividades(comboParaActualizar)
  const usuarioLogueadoActividad = JSON.parse(localStorage.getItem("UsuarioLogueadoApp"));
  const tiempo = document.querySelector("#txtTiempoActividad").value;
  const fecha = document.querySelector("#txtFechaActividad").value;
  document.querySelector("#btnRegistrarActividad").innerHTML = "";

  const nuevaActividad = {
    idActividad: +1,
    idUsuario: usuarioLogueadoActividad.id,
    tiempo: tiempo,
    fecha: fecha,
    titulo: titulo,
  };
  console.log(nuevaActividad);

  const urlApi = apiBaseURL + "registros.php";
  fetch(urlApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: usuarioLogueadoActividad.apiKey,
      iduser: usuarioLogueadoActividad.id,
    },
    body: JSON.stringify(nuevaActividad),
  })
    .then((respuestaAPI) => {
      if (respuestaAPI.status === 401) {
        cerrarSesionPorFaltaDeToken();
        mostrarToast("ERROR", "Error", respuestaAPI.mensaje);
      }
      return respuestaAPI.json();
    })
    .then((respuestaBody) => {
      if (respuestaBody.mensaje) {
        mostrarToast("ERROR", "Error", respuestaBody.mensaje);
      } else if (respuestaBody?.data?.length > 0) {
        respuestaBody.data.forEach((a) => {
          actividades.push(Actividad.parse(a));
        });
        completarTablaActividades();
      } else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }
      console.log(respuestaBody);
    })
    .catch((error) => console.log("Error:", error));
}

async function mostrarToast(tipo, titulo, mensaje) {
  const toast = document.createElement("ion-toast");
  toast.header = titulo;
  toast.message = mensaje;
  toast.position = "bottom";
  toast.duration = 3000;
  if (tipo === "ERROR") {
    toast.color = "danger";
  } else if (tipo === "SUCCESS") {
    toast.color = "success";
  } else if (tipo === "WARNING") {
    toast.color = "warning";
  }

  document.body.appendChild(toast);
  return toast.present();
}

function cerrarSesionPorFaltaDeToken() {
  mostrarToast("ERROR", "No autorizado", "Se ha cerrado sesión por seguridad.");
  cerrarSesion();
}

//Funciones Aux
function borrarDatos() {
  document.querySelector("#txtLoginMail").value = "";
  document.querySelector("#txtLoginPassword").value = "";
}
