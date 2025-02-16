//Variables y constantes
let usuarioLogueado = null;
let actividades = null;

const apiBaseURL = "https://movetrack.develotion.com/";

//DOM
const HOME = document.querySelector("#home"); //definir Home
const SCREEN_LOGIN = document.querySelector("#login");
const SCREEN_REG = document.querySelector("#regUsuario");
const REG_ACTIVIDADES = document.querySelector("#regActividades");
const NAV = document.querySelector("#nav");
const ROUTER = document.querySelector("#ruteo");
const MENU = document.querySelector("#menu");
const VER_ACTIVIDADES = document.querySelector("#verActividades");
const VER_USUARIOS = document.querySelector("#verUsuarios");

//Inicialización del sistema
inicializar();

function inicializar() {
  subscripcionEventos();
}

function actualizarUsuarioLogueadoDesdeLS() {
  let usuarioRecuperado = localStorage.getItem("UsuarioLogueadoApp"); //nos devulve un texto
  if (usuarioRecuperado) usuarioLogueado = usuarioRecuperado; //parseo para ver el objeto que se guardo en el localStorage
}

function subscripcionEventos() {
  //Routeo
  ROUTER.addEventListener("ionRouteDidChange", navegar);
  //Login
  document
    .querySelector("#btnLoginUsuario")
    .addEventListener("click", btnLoginSesionHandler);
  //RegistroUsuario
  document
    .querySelector("#btnRegistroUsuario")
    .addEventListener("click", btnRegistroUsuarioHandler);

  document
    .querySelector("#btnVerActividades")
    .addEventListener("click", btnMostrarActividades);
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
      mostrarLogin();
      break;
    case "/regUsuario":
      mostrarRegistroUsuario();
      break;
    case "/regActividades":
      mostrarRegistroActividades();
      break;
    case "/verActividades":
      mostrarVerActividades();
      break;
  }
}

function verificarInicio() {
  if (usuarioLogueado) {
    NAV.setRoot("page-actividades");
    NAV.popToRoot();
  } else {
    NAV.setRoot("page-login");
    NAV.popToRoot();
  }
}

function mostrarLogin() {
  ocultarPantallas();
  SCREEN_LOGIN.style.display = "block";
}

function mostrarRegistroUsuario() {
  ocultarPantallas();
  SCREEN_REG.style.display = "block";
}

function mostrarRegistroActividades() {
  ocultarPantallas();
  REG_ACTIVIDADES.style.display = "block";
}

function mostrarVerActividades() {
  ocultarPantallas();
  VER_ACTIVIDADES.style.display = "block";
}

function ocultarPantallas() {
  HOME.style.display = "none";
  SCREEN_LOGIN.style.display = "none";
  SCREEN_REG.style.display = "none";
  REG_ACTIVIDADES.style.display = "none";
  VER_ACTIVIDADES.style.display = "none";
  VER_USUARIOS.style.display = "none";
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

function cerrarSesion() {
  cerrarMenu();
  usuarioLogueado = null;
  localStorage.clear();
  NAV.setRoot("page-login");
  NAV.popToRoot();
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

  let verificacionPasswordIngresado = document.querySelector("#passwordRegistroVerificacion").value;
  document.querySelector("#pRegistro").innerHTML = "";

  if (usuarioIngresado && passwordIngresado && paisIngresado) {
    if (passwordIngresado === verificacionPasswordIngresado) {
      //llamamos a la API
      const urlAPI = apiBaseURL + "usuarios";
      const bodyDeSolicitud = {
        nombre: nombreIngresado,
        apellido: apellidoIngresado,
        direccion: direcciónIngresado,
        email: emailIngresado,
        password: passwordIngresado,
      }; //variables con los datos de los usuarios
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
            document.querySelector("#pRegistro").innerHTML = "Usuario correctamente registrado, puede iniciar sesión";
          } else {
            document.querySelector("#pRegistro").innerHTML = "Ha ocurrido un error, intente más tarde";
          }
          return respuestaDeApi.json();
      })
        .then((respuestaBody) => {
           if (respuestaBody.error)
            document.querySelector("#pRegistro").innerHTML = respuestaBody.error;
      })
        .catch((error) => console.log(error));
        
    } else {
      document.querySelector("#pRegistro").innerHTML =
        "Ya existe un usuario con ese email.";
    }
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
          document.querySelector("#pLogin").innerHTML = "Ha ocurrido un error, intente nuevamente";
        return respuestaLogin.json();
      })
      .then((respuestaBody) => {
        if (respuestaBody.apiKey) {
          borrarDatos();
          usuarioLogueado = Usuario.parse(respuestaBody.apiKey);
          localStorage.setItem(
            "UsuarioLogueadoIntegrador",
            JSON.stringify(usuarioLogueado)
          ); //Queda en el localSorage el UsuarioLogueadoAPP
          NAV.setRoot("page-actividades");
          NAV.popToRoot();
        } else if (respuestaBody.error)
          document.querySelector("#pLogin").innerHTML = respuestaBody.error;        
      })
      .catch((error) => console.log(error));
  } else {
    document.querySelector("#pLogin").innerHTML = "Todos los campos son obligatorios";
  }
}

function btnMostrarActividades() {
  fetch(apiBaseURL + "/actividades.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-auth": usuarioLogueado.apiKey,
    },
  })
    .then((respuestaAPI) => {
      if (respuestaAPI.status === 401) {
        cerrarSesionPorFaltaDeToken();
      } else {
        return respuestaAPI.json();
      }
    })
    .then((respuestaBody) => {
      if (respuestaBody?.error) {
        mostrarToast("ERROR", "Error", respuestaBody.error);
      } else if (respuestaBody?.data?.length > 0) {
        respuestaBody.data.forEach((a) => {
          actividades.push(Actividad.parse(a));
        });
        completarTablaActividades();
      } else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }
    })
    .catch((error) => console.log(error));
}

function completarTablaActividades() {
  if (actividades.length === 0) {
    listadoAct = "No se encontraron actividades.";
  } else {
    let listadoAct = "<ion-list>";
    listadoAct += `
              <ion-item class="ion-item-producto" producto-id="${a.id}">
                  <ion-thumbnail slot="start">
                      <img src="${a.getURLImagen()}" width="100"/>
                  </ion-thumbnail>
                  <ion-label>
                      <h2>${a.nombre}</h2>
  
                  </ion-label>
                  
              </ion-item>
          `;

    listadoAct += "</ion-list>";

    document.querySelector("#divAct").innerHTML = listadoAct;
  }
}

async function mostrarToast(tipo, titulo, mensaje) {
  const toast = document.createElement("ion-toast");
  toast.header = titulo;
  toast.message = mensaje;
  toast.position = "bottom";
  toast.duration = 2000;
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