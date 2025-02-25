//Variables y constantes
let usuarioLogueado = null;
let actividades = [];
let actividadesCreadas = [];
let actividadVisualizada = [];
let actividadesFiltradas = [];
let paises = [];
let usuariosPaises = [];
let usuarios=[];

const apiBaseURL = "https://movetrack.develotion.com/";

let map = null;
let marcadorUsuarios = null;

let posicionUsuario = {
   latitude: -34.90, 
   longitude: -56.19
}





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
const SCREEN_VER_USUARIOS_MAPA = document.querySelector("#verUsuarios");
const COMBO_FILTRO_ACTIVIDADES = document.querySelector("#selectorActividad");
const INPUT_FILTRO_PRODUCTOS = document.querySelector("#txtActFiltro");
const PAISES = document.querySelector("#selectorPaís");


//Inicialización del sistema
inicializar();

function inicializar() {
  subscripcionEventos();
  cargarUbicacionUsuario()
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
  //COMBO_FILTRO_ACTIVIDADES.addEventListener("ionChange", comboActividadesChangeHandler);

  //Registrar Actividad
  document.querySelector("#btnRegistrarActividad").addEventListener("click", registrarActividad);

  //Search
  INPUT_FILTRO_PRODUCTOS.addEventListener("ionChange",inputFiltroProductosChangeHandler);

  //Detalle Actividad
  document.querySelector("#btnDetalleActividadVolver").addEventListener("click", btnDetalleActividadVolverHandler);

  //PAISES
  PAISES.addEventListener("ionChange", ObtenerListadoPaises);  

  //Eliminar Actividad
 // document.querySelector("#eliminarActividad").addEventListener("click", eliminarActividad);
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
  ObtenerListadoPaises(PAISES);
}

function mostrarPantallaRegistroActividades() {
  ocultarPantallas();
  SCREEN_REG_ACTIVIDADES.style.display = "block";
  cargarSelectorActividades(COMBO_FILTRO_ACTIVIDADES);
}

function mostrarPantallaActividades() {
  ocultarPantallas();
  SCREEN_VER_ACTIVIDADES.style.display = "block";
  ObtenerActividadesCreadas();
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
  SCREEN_VER_USUARIOS_MAPA.style.display = "none";
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
  SCREEN_VER_USUARIOS_MAPA.style.display = "block";  
  inicializarMapa();  
  obtenerUbicacionUsuariosPorPais()  
  
}


function inicializarMapa() {
  

  if (!map) {
    map = L.map("miMapa").setView([posicionUsuario.latitude, posicionUsuario.longitude], 15); //metodo para inicializar un mapa
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    L.marker([posicionUsuario.latitude, posicionUsuario.longitude]).addTo(map).bindPopup("Ubicación del Usuario")  
   
   
    /*let myIcon = L.icon({
      iconUrl: "../www/img/banderaUruguay.jpg",
      iconSize: [100, 80],      
  });  */
    
  }
}

function obtenerUbicacionUsuariosPorPais() {
  usuariosPaises =[]
  const usuarioLogueadoVerActividad = JSON.parse(localStorage.getItem("UsuarioLogueadoApp"));

  const urlAPI = apiBaseURL + "usuariosPorPais.php";

  fetch(urlAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: usuarioLogueadoVerActividad.apiKey,
      iduser: usuarioLogueadoVerActividad.id,      
    },
  })
    .then((respuestaAPI) => {
      if (respuestaAPI.status === 401) {
        cerrarSesionPorFaltaDeToken();
      } else return respuestaAPI.json();
    })
    .then((respuestaBody) => {
      console.log("Respuesta procesada (JSON):", respuestaBody);
      if (respuestaBody.mensaje) {
        mostrarToast("ERROR", "Error", respuestaBody.mensaje);
      } else if (respuestaBody?.paises?.length > 0) {
        respuestaBody.paises.forEach((p) => {
          usuariosPaises.push(p)          
        });
        console.log(usuariosPaises);
        console.log("Lista de países con coordenadas:", paises); // Verifica que se guardan bien        
      } else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }
    })
    .catch((mensaje) => console.error("Error en la API:", mensaje));
}

function obtenerIdPaisDeUsuarioLogueado() {
  window.navigator.geolocation.getCurrentPosition((pos) => {
    if (pos.coords.latitude) {
      posicionUsuario = {
        latitude: pos?.coords?.latitude,
        longitude: pos?.coords?.longitude,
      };
    }
  });
}

/*function obtenerUbicacionesPaises() {
  let coordenadas = []; // Array para almacenar todas las latitudes y longitudes
  paises.forEach((pais, i) => {
    console.log(`Índice ${i}: Latitud: ${pais.latitud}, Longitud: ${pais.longitud}`);
    coordenadas.push({ latitud: pais.latitud, longitud: pais.longitud });
  });
  return coordenadas; // Devuelve un array con todas las coordenadas
}*/


function obtenerPaisPorId(id) {
  let pai = null;
  let i = 0;
  console.log("Lista de países:", paises);
  while (!pai && i < paises.length) { // Se ejecuta mientras pai sea null y i sea menor a paises.length
    const paisActual = paises[i];
    console.log("Iteración:", i, "paises:", paisActual);
    if (paisActual.id === id) {
      pai = paisActual; // Aquí se asigna el país si coincide con el id
    }
    i++;
  }
  console.log(pai);  
  return pai;
}

function cargarUbicacionUsuario() {
  window.navigator.geolocation.getCurrentPosition(
    (pos) => {
      if (pos.coords.latitude) {
        posicionUsuario = {
          latitude: pos?.coords?.latitude,  
          longitude: pos?.coords?.longitude 
        };
        console.log(pos);        
        console.log("Ubicación del usuario:", posicionUsuario);         
      }
    },
    (err) => {
      console.log("No se pudo obtener la ubicación. Asumo que el usuario está en ORT.");
      posicionUsuario = { latitude: -34.9011, longitude: -56.1645 }; // Coordenadas de ORT Uruguay      
    }
  );
}

function comboPaisesChangeHandler(evt) {
  const pais = obtenerPaisPorId(evt.detail.value);
  const nombre = pais.nombre;
  console.log(nombre);
}

function btnDetalleActividadVolverHandler() {
  actividadVisualizada = null;
  NAV.pop();
}

//Registro de usuarios
function btnRegistroUsuarioHandler() {
  let usuarioIngresado = document.querySelector("#txtNombreRegistro").value;
  let passwordIngresado = document.querySelector("#txtPasswoedIngresado").value;
  let paisIngresado = document.querySelector("#selectorPaís").value;

  document.querySelector("#pRegistro").innerHTML = "";

  if (usuarioIngresado && passwordIngresado && paisIngresado) {
    //llamamos a la API
    const urlAPI = apiBaseURL + "usuarios.php";
    const bodyDeSolicitud = {
      //variables con los datos de los usuarios
      usuario: usuarioIngresado,
      password: passwordIngresado,
      idPais: paisIngresado,
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
          document.querySelector("#pRegistro").innerHTML = "Usuario correctamente registrado, puede iniciar sesión";
        } else {
          document.querySelector("#pRegistro").innerHTML = "Ha ocurrido un error, intente más tarde";
        }
        return respuestaDeApi.json();
      })
      .then((respuestaBody) => {        
        borrarDatos();
        if (respuestaBody.mensaje)document.querySelector("#pRegistro").innerHTML = respuestaBody.mensaje;
      })
      .catch((mensaje) => console.log(mensaje));
  } else {
    document.querySelector("#pRegistro").innerHTML = "Todos los campos son obligatorios";
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
          NAV.setRoot("page-actividades");
          // NAV.popToRoot();
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

//Paises
function ObtenerListadoPaises(comboParaActualizar) {
  paises = [];
  const urlAPI = apiBaseURL + "paises.php";

  fetch(urlAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((respuestaAPI) => {
      if (respuestaAPI.status === 401) {
        cerrarSesionPorFaltaDeToken();
      } else return respuestaAPI.json();
    })
    .then((respuestaBody) => {
      console.log("Respuesta procesada (JSON):", respuestaBody);
      if (respuestaBody.mensaje) {
        mostrarToast("ERROR", "Error", respuestaBody.mensaje);
      } else if (respuestaBody?.paises?.length > 0) {
        respuestaBody.paises.forEach((p) => {
          paises.push(Pais.parse(p));
        });
        actualizarComboPaises(comboParaActualizar);
      } else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }      
    })
    .catch((mensaje) => console.log(mensaje));    
}

function actualizarComboPaises(comboParaActualizar) {
  comboParaActualizar.innerHTML = "";
  for (let i = 0; i < paises.length; i++) {
    const paisActual = paises[i];
    comboParaActualizar.innerHTML += `<ion-select-option value="${paisActual.id}">${paisActual.name}</ion-select-option>`;
  }
}

function comboPaisesChangeHandler(evt) {
  const pais = obtenerPaisPorId(evt.detail.value);
  const nombre = pais.nombre;
  console.log(nombre);
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
      } else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }
    })
    .catch((mensaje) => console.log(mensaje));
}

//lista de Ver Registro
// function listarRegistros() {
//   let listadoDeRegistros = "<ion-list>";
//   actividades.forEach((a) => {
//     if (actividades.length === 0) {
//       listadoDeRegistros = `<p>No se encontraron actividades.</p>`;
//     } else {
//       listadoDeRegistros += `
//         <ion-item class="ion-item-producto">
//         <ion-thumbnail slot="start">
//             <img src="${a.getURLImagen()}" width="100"/>
//         </ion-thumbnail>
//         <ion-label>
//             <h2><strong>${a.nombre}</strong></h2>
//         </ion-label>

//         <ion-button class="btnVerDetalleActividad" color="warning"
//         style="padding:15px;" detalle-id="${a.id}">
//         <ion-icon slot="icon-only" name="search-sharp"></ion-icon>
//         </ion-button>

//         <ion-button color="medium" >
//         <ion-icon slot="icon-only" name="trash-sharp"></ion-icon>
//         </ion-button>

//         </ion-item>
//       `;
//     }
//   });
//   listadoDeRegistros += "</ion-list>";
//   document.querySelector("#divAct").innerHTML = listadoDeRegistros;
//   const botonesTraidosHTML = document.querySelectorAll(
//     ".btnVerDetalleActividad"
//   );
//   if (botonesTraidosHTML?.length > 0) {
//     botonesTraidosHTML.forEach((b) => {
//       b.addEventListener("click", verDetalleActividad);
//     });
//   }
// }

//TODO: falta terminar
function eliminarActividad() {
  const usuarioLogueadoEliminarActividad = JSON.parse(
    localStorage.getItem("UsuarioLogueadoApp")
  );

  const idActividad = this.getAttribute("detalle-id");

  const urlApi = `${apiBaseURL}registros.php?idUsuario=${usuarioLogueadoEliminarActividad.id}`;

  if (idActividad) {
    fetch(urlApi, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        apikey: usuarioLogueadoEliminarActividad.apiKey,
        iduser: usuarioLogueadoEliminarActividad.id,
      },
    })
      .then((respuestaDeLaAPI) => {
        if (respuestaDeLaAPI.status === 401) cerrarSesionPorFaltaDeToken();
        return respuestaDeLaAPI.json();
      })
      .then((bodyDeLaRespuesta) => {
        if (bodyDeLaRespuesta.success) {
          actividadesCreadas = actividadesCreadas.filter(
            (actividad) => actividad.idActividad !== idActividad
          );
          renderizarActividades(actividadesCreadas);
          mostrarToast(
            "SUCCESS",
            "Éxito",
            "Actividad eliminada correctamente."
          );
        }
      })
      .catch((error) => console.log("Error:", error));
  } else {
    mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
  }
}

//acceder a pantalla de detalle de la actividad
// function verDetalleActividad() {
//   const idActividadDetalle = this.getAttribute("detalle-id");

//   const usuarioLogueadoVerActividad = JSON.parse(
//     localStorage.getItem("UsuarioLogueadoApp")
//   );
//   const urlAPI = apiBaseURL;

//   if (idActividadDetalle) {
//     const URLCompleta = urlAPI + "registros.php";

//     fetch(URLCompleta, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         apikey: usuarioLogueadoVerActividad.apiKey,
//         iduser: usuarioLogueadoVerActividad.id,
//       },
//     })
//       .then((respuestaDeLaAPI) => {
//         if (respuestaDeLaAPI.status === 401) cerrarSesionPorFaltaDeToken();
//         return respuestaDeLaAPI.json();
//       })
//       .then((bodyDeLaRespuesta) => {
//         let actividadSeleccionada = null;

//         if (
//           bodyDeLaRespuesta.actividades &&
//           bodyDeLaRespuesta.actividades.length > 0
//         ) {
//           bodyDeLaRespuesta.actividades.forEach((actividad) => {
//             if (actividad.id == idActividadDetalle) {
//               actividadSeleccionada = actividad;
//             }
//           });

//           if (actividadSeleccionada) {
//             actividadVisualizada = Actividad.parse(actividadSeleccionada);
//             completarPantallaDetalleActividad();
//             NAV.push("page-detalleActividad");
//           } else {
//             mostrarToast(
//               "ERROR",
//               "Error",
//               "No se encontró la actividad seleccionada."
//             );
//           }
//         } else {
//           mostrarToast(
//             "ERROR",
//             "Error",
//             "No se encontraron detalles para la actividad."
//           );
//         }
//       })
//       .catch((error) => {
//         console.error("Error en la petición:", error);
//         mostrarToast(
//           "ERROR",
//           "Error",
//           "Hubo un problema al obtener los detalles."
//         );
//       });
//   } else {
//     mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
//   }
// }

function completarTablaActividades() {
  let listadoActividades = "<ion-list>";
  actividadesFiltradas.forEach((a) => {
    listadoActividades += `
        <ion-item class="ion-item-producto" producto-id="${a.id}">
            <ion-thumbnail slot="start">
                <img src="${a.getURLImagen()}" width="100"/>
            </ion-thumbnail>
            <ion-label>
                <h2>${a.nombre}</h2>                
            </ion-label>              
        </ion-item>
      `;
  });
  listadoActividades += "</ion-list>";

  if (actividadesFiltradas.length === 0) {
    listadoActividades = "No se encontraron actividades.";
  }

  document.querySelector("#divAct").innerHTML = listadoActividades;
}

function inputFiltroProductosChangeHandler() {
  actualizarProductosFiltrados();
  completarTablaActividades();
}

function actualizarProductosFiltrados() {
  const filtroIngresado = document
    .querySelector("#txtActFiltro")
    .value.trim()
    .toUpperCase();
  actividadesFiltradas = [];
  if (filtroIngresado === "") {
    actividadesFiltradas = actividades;
  } else {
    for (let i = 0; i < actividades.length; i++) {
      const actividadActual = actividades[i];
      for (let j = 0; j < actividadActual.length; j++) {
        const etiquetaActual = actividadActual.etiquetas[j];
        if (etiquetaActual.toUpperCase().includes(filtroIngresado)) {
          actividadesFiltradas.push(actividadActual);
          break;
        }
      }
    }
  }
}

function ObtenerActividadesCreadas() {
  const usuarioLogueadoActividad = JSON.parse(
    localStorage.getItem("UsuarioLogueadoApp")
  );

  const urlApi = `${apiBaseURL}registros.php?idUsuario=${usuarioLogueadoActividad.id}`;

  fetch(urlApi, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: usuarioLogueadoActividad.apiKey,
      iduser: usuarioLogueadoActividad.id,
    },
  })
    .then((respuestaAPI) => {
      if (respuestaAPI.status === 401) {
        cerrarSesionPorFaltaDeToken();
        mostrarToast("ERROR", "Error", respuestaAPI.mensaje);
      }
      return respuestaAPI.json();
    })
    .then((respuestaBody) => {
      if (respuestaBody?.registros) {
        actividadesCreadas = respuestaBody.registros; // Guardamos las actividades obtenidas
        renderizarActividades(actividadesCreadas); // Llamamos la función para actualizar el DOM
        mostrarToast("SUCCESS", "Éxito", "Actividades obtenidas correctamente");
      } else {
        mostrarToast("ERROR", "Error", "No tienes actividades registradas");
      }
    })
    .catch((error) => {
      console.error("Error obteniendo actividades:", error);
      mostrarToast("ERROR", "Error", "No se pudieron obtener las actividades");
    });
}

function renderizarActividades(actividadesCreadas) {
  const usuarioLogueadoActividad = JSON.parse(
    localStorage.getItem("UsuarioLogueadoApp")
  );

  let listadoActividades = "<ion-list>";
  actividades.forEach((a) => {
    actividadesCreadas.forEach((ac) => {
      if (
        ac.idActividad == a.id &&
        usuarioLogueadoActividad.id == ac.idUsuario
      ) {
        listadoActividades += `
        <ion-item class="ion-item-actividad" actividad-id="${a.id}">
          <div>
          <ion-thumbnail slot="start">
                  <img src="${a.getURLImagen()}" width="100"/>
              </ion-thumbnail>
            
              <ion-label>
                  <h2>${a.nombre}</h2>                
              </ion-label> 
         
            <p>Tiempo: ${ac.tiempo}</p>
            
            <p>Fecha: ${ac.fecha}</p>

            <ion-button color="medium" actividad-id="${
              ac.idActividad
            }" id="eliminarActividad">
            <ion-icon slot="icon-only" name="trash-sharp"></ion-icon>
            </ion-button>
          </div>
          
          </ion-item>
        
         `;
      } else {
        listadoActividades += `</ion-item>`;
      }
    });
  });

  listadoActividades += "</ion-list> <br><br>";

  if (actividadesCreadas.length === 0) {
    listadoActividades = "No se encontraron actividades.";
  }

  document.querySelector("#divAct").innerHTML += listadoActividades;
}

//Registro de actividades
function registrarActividad() {
  const usuarioLogueadoActividad = JSON.parse(
    localStorage.getItem("UsuarioLogueadoApp")
  );

  const actividadSeleccionada =
    document.querySelector("#selectorActividad").value;
  const tiempo = document.querySelector("#txtTiempoActividad").value;
  const fecha = document.querySelector("#txtFechaActividad").value;

  if (!actividadSeleccionada || !tiempo || !fecha) {
    mostrarToast("ERROR", "Error", "Todos los campos son obligatorios.");
    return;
  }

  const nuevaActividad = {
    idActividad: actividadSeleccionada,
    idUsuario: usuarioLogueadoActividad.id,
    tiempo: tiempo,
    fecha: fecha,
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
      if (respuestaBody?.idRegistro) {
        actividadesCreadas.push(nuevaActividad);
        mostrarToast("SUCCESS", "Éxito", "Registro de actividad exitoso");
        borrarDatos()
      } else {
        mostrarToast("ERROR", "Error", respuestaBody.mensaje);
      }
    })
    .catch((error) => console.log("Error:", error));
}

//TODO Registro de actividades - Selector de listado de actividades
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
      if (respuestaBody && respuestaBody.mensaje) {
        mostrarToast("ERROR", "Error", respuestaBody.mensaje);
      } else if (respuestaBody?.actividades?.length > 0) {
        respuestaBody.actividades.forEach((a) => {
          actividades.push(Actividad.parse(a));
        });
        actualizarComboActividades(comboParaActualizar);
      } else {
        mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
      }
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

function obtenerActividadPorId(id) {
  let act = null;
  let i = 0;
  while (!act && i < actividades.length) {
    const actividadesActual = actividades[i];
    console.log("Iteración:", i, "Actividad:", actividadesActual);
    if (actividadesActual.id === id) {
      act = actividadesActual;
    }
    i++;
  }
  console.log(act);  
  return act;
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
  document.querySelector("#txtTiempoActividad").value=""; 
  document.querySelector("#txtFechaActividad").value="";
  document.querySelector("#txtNombreRegistro").value ="";
  document.querySelector("#txtPasswoedIngresado").value ="";
  document.querySelector("#selectorPaís").value="";
}
