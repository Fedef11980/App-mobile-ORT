//Variables y constantes
let usuarioLogueado = null;
const apiBaseURL = "https://movetrack.develotion.com/";

//DOM
const HOME = document.querySelector("#home"); //definir Home
const SCREEN_LOGIN = document.querySelector("#login");
const SCREEN_REG = document.querySelector("#regUsuario");
const REG_ACTIVIDADES = document.querySelector("#regActividades");
const NAV = document.querySelector("#nav");
const ROUTER = document.querySelector("#ruteo");
const MENU = document.querySelector("#menu");

//Inicialización del sistema
inicializar();

function inicializar() {
  subscripcionEventos();
}

function actualizarUsuarioLogueadoDesdeLS() {
  let usuarioRecuperado = localStorage.getItem("UsuarioLogueadoApp"); //nos devulve un texto
  if (usuarioRecuperado) usuarioLogueado = JSON.parse(usuarioRecuperado); //parseo para ver el objeto que se guardo en el localStorage
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

function ocultarPantallas() {
  HOME.style.display = "none";
  SCREEN_LOGIN.style.display = "none";
  SCREEN_REG.style.display = "none";
  REG_ACTIVIDADES.style.display = "none";
}

function actualizarMenu() {
  document.querySelector("#btnMenuLogin").style.display = "none";
  document.querySelector("#btnMenuRegistro").style.display = "none";
  document.querySelector("#btnMenuRegActividades").style.display = "none";
  document.querySelector("#btnMenuCerrarSesion").style.display = "none";

  if (usuarioLogueado) {
    document.querySelector("#btnMenuRegActividades").style.display = "block";
    document.querySelector("#btnMenuCerrarSesion").style.display = "block";
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
  let nombreIngresado = document.querySelector("#txtRegistroNombre").value;
  let apellidoIngresado = document.querySelector("#txtRegistroApellido").value;
  let paisIngresado = document.querySelector("#").value;

  let verificacionPasswordIngresado = document.querySelector(
    "#passwordRegistroVerificacion"
  ).value;

  document.querySelector("#pRegistro").innerHTML = "";

  if (
    nombreIngresado &&
    apellidoIngresado &&
    direcciónIngresado &&
    emailIngresado &&
    passwordIngresado &&
    verificacionPasswordIngresado
  ) {
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
            document.querySelector("#pRegistro").innerHTML =
              "Usuario correctamente registrado, puede iniciar sesión";
          } else {
            document.querySelector("#pRegistro").innerHTML =
              "Ha ocurrido un error, intente más tarde";
          }
          return respuestaDeApi.json();
        })
        .then((respuestaBody) => {
          if (respuestaBody.error)
            document.querySelector("#pRegistro").innerHTML =
              respuestaBody.error;
        })
        .catch((error) => {
          console.log(error);
        });
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
  let emailLogin = document.querySelector("#txtLoginMail").value;
  let passwordLogin = document.querySelector("#txtLoginPassword").value;

  document.querySelector("#pLogin").innerHTML = "";

  if (emailLogin && passwordLogin) {
    const urlAPI = apiBaseURL + "login.php";
    const usuarioLogin = {
      email: emailLogin,
      password: passwordLogin,
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
        if (respuestaBody.data?.token) {
          borrarDatos();
          usuarioLogueado = Usuario.parse(respuestaBody.data);
          localStorage.setItem(
            "UsuarioLogueadoApp",
            JSON.stringify(usuarioLogueado)
          ); //Queda en el localSorage el UsuarioLogueado
          NAV.setRoot("page-actividades");
          NAV.popToRoot();
        } else if (respuestaBody.error)
          document.querySelector("#pLogin").innerHTML = respuestaBody.error;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    document.querySelector("#pLogin").innerHTML =
      "Todos los campos son obligatorios";
  }
}

//Funciones Aux
function borrarDatos() {
  document.querySelector("#txtLoginMail").value = "";
  document.querySelector("#txtLoginPassword").value = "";
}
