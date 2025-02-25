//Variables y constantes
let usuarioLogueado = null;
let actividades = [];
let actividadesCreadas = [];
let actividadesFiltradas = [];
let paises = [];
let usuariosPaises = [];
let usuarios = [];

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
const SCREEN_VER_USUARIOS_MAPA = document.querySelector("#verUsuarios");
const COMBO_FILTRO_ACTIVIDADES = document.querySelector("#selectorActividad");
const COMBO_SELECT_ACTIVIDADES = document.querySelector("#slcActFiltro");
const PAISES = document.querySelector("#selectorPaís");

//Inicialización del sistema
inicializar();

function inicializar() {
  subscripcionEventos();
  cargarUbicacionUsuario();
}

function actualizarUsuarioLogueadoDesdeLS() {
  let usuarioRecuperado = localStorage.getItem("UsuarioLogueadoApp"); //nos devuelve un texto
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

  // Filtrar Actividades
  COMBO_SELECT_ACTIVIDADES.addEventListener("ionChange", filtrarListadoActividades)

  //Registrar Actividad
  document
    .querySelector("#btnRegistrarActividad")
    .addEventListener("click", registrarActividad);

    //PAISES
  PAISES.addEventListener("ionChange", ObtenerListadoPaises);
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
  cargarSelectorActividades(COMBO_FILTRO_ACTIVIDADES);
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
 
}

function cerrarSesion() {
  cerrarMenu();
  usuarioLogueado = null;
  localStorage.clear();
  NAV.setRoot("page-login");
  NAV.popToRoot();
}

//Mapas
async function mostrarMapaUsuarios() {
  ocultarPantallas();
  SCREEN_VER_USUARIOS_MAPA.style.display = "block";  
  await inicializarMapa();
}

async function inicializarMapa() {
  try {
    // Obtener los países con sus coordenadas
    const paises = await RetornarListaDePaises();
   
    
    // Obtener los usuarios por país
    const usuariosPorPais = await obtenerUbicacionUsuariosPorPais();
    
    
    // Crear mapa si no existe
    if (!map) {
      map = L.map("miMapa").setView(
        [posicionUsuario.latitude, posicionUsuario.longitude],
        2  // Zoom más alejado para ver más países
      );
      
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
      
      // Añadir marcador para la ubicación del usuario
      L.marker([posicionUsuario.latitude, posicionUsuario.longitude])
        .addTo(map)
        .bindPopup("Tu ubicación")
        .openPopup();
      
      // Limitar a los 10 países con más usuarios
      const paisesConUsuarios = [];
      
      // Combinar datos de países con datos de usuarios
      for( const paisSudamerica of paises ){        
        for (const paisUsuario of usuariosPorPais) {
          const paisInfo = paises.find(p => p.id === paisUsuario.id);
          if (paisUsuario.id === paisSudamerica.id) {
            paisesConUsuarios.push({
              id: paisInfo.id,
              nombre: paisInfo.name,
              latitud: paisInfo.latitude,
              longitud: paisInfo.longitude,
              cantidadUsuarios: paisSudamerica.cantidadDeUsuarios
            });
            break;
          }
        }        
      }
      
      // Ordenar por cantidad de usuarios (de mayor a menor)
      paisesConUsuarios.sort((a, b) => b.cantidadUsuarios - a.cantidadUsuarios);
      
      // Limitar a los 10 primeros
      const top10Paises = paisesConUsuarios.slice(0, 10);      
      
      // Crear icono personalizado para los marcadores
      const iconoUsuarios = L.divIcon({
        className: 'marcador-usuarios',
        html: '<div style="background-color: #3880ff; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">👥</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      // Añadir marcadores para cada país del top 10
      top10Paises.forEach(pais => {
        const marker = L.marker([pais.latitud, pais.longitud], {icon: iconoUsuarios})
          .addTo(map)
          .bindPopup(`<b>${pais.nombre}</b><br>Usuarios: ${pais.cantidadUsuarios}`);
          
        // Añadir tooltip permanente
        marker.bindTooltip(`${pais.cantidadUsuarios} usuarios`, 
          {permanent: true, direction: 'top', className: 'tooltip-usuarios'}
        );
      });
      
      // Añadir estilos para el tooltip
      const style = document.createElement('style');
      style.textContent = `
        .tooltip-usuarios {
          background-color: #3880ff;
          border: none;
          color: white;
          font-weight: bold;
          padding: 5px 10px;
          border-radius: 10px;
        }
        .marcador-usuarios {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `;
      document.head.appendChild(style);
    }
  } catch (error) {
    console.error("Error al inicializar mapa:", error);
    mostrarToast("ERROR", "Error", "Problema al inicializar el mapa");
  }
}

async function obtenerUbicacionUsuariosPorPais() {
  usuariosPaises = [];
  const usuarioLogueadoVerActividad = JSON.parse(localStorage.getItem("UsuarioLogueadoApp"));

  const urlAPI = apiBaseURL + "usuariosPorPais.php";

  try {
    const respuestaAPI = await fetch(urlAPI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: usuarioLogueadoVerActividad.apiKey,
        iduser: usuarioLogueadoVerActividad.id,
      },
    });

    if (respuestaAPI.status === 401) {
      cerrarSesionPorFaltaDeToken();
      return [];
    }

    const respuestaBody = await respuestaAPI.json();

    if (respuestaBody.mensaje) {
      mostrarToast("ERROR", "Error", respuestaBody.mensaje);
      return [];
    } 
    
    if (respuestaBody?.paises?.length > 0) {
      usuariosPaises = respuestaBody.paises;
      return usuariosPaises;
    }
    
    return [];
  } catch (error) {
    console.error("Error al obtener usuarios por país:", error);
    mostrarToast("ERROR", "Error", "No se pudieron obtener los usuarios por país");
    return [];
  }
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

function obtenerPaisPorId(id) {
  let pai = null;
  let i = 0;
 
  while (!pai && i < paises.length) {
    // Se ejecuta mientras pai sea null y i sea menor a paises.length
    const paisActual = paises[i];
    if (paisActual.id === id) {
      pai = paisActual; // Aquí se asigna el país si coincide con el id
    }
    i++;
  }
  return pai;
}

function cargarUbicacionUsuario() {
  window.navigator.geolocation.getCurrentPosition(
    (pos) => {
      if (pos.coords.latitude) {
        posicionUsuario = {
          latitude: pos?.coords?.latitude,
          longitude: pos?.coords?.longitude,
        };
      }
    },
    (err) => {
      console.log(
        "No se pudo obtener la ubicación. Asumo que el usuario está en ORT."
      );
      posicionUsuario = { latitude: -34.9011, longitude: -56.1645 }; // Coordenadas de ORT Uruguay
    }
  );
}

function comboPaisesChangeHandler(evt) {
  const pais = obtenerPaisPorId(evt.detail.value);
  const nombre = pais.nombre;
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
          document.querySelector("#pRegistro").innerHTML =
            "Usuario correctamente registrado, puede iniciar sesión";
        } else {
          document.querySelector("#pRegistro").innerHTML =
            "Ha ocurrido un error, intente más tarde";
        }
        return respuestaDeApi.json();
      })
      .then((respuestaBody) => {
        borrarDatos();
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

async function RetornarListaDePaises() {
  try {
    const urlAPI = apiBaseURL + "paises.php";
    const respuestaAPI = await fetch(urlAPI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (respuestaAPI.status === 401) {
      cerrarSesionPorFaltaDeToken();
      return [];
    }
    
    const respuestaBody = await respuestaAPI.json();
    
    if (respuestaBody.mensaje) {
      mostrarToast("ERROR", "Error", respuestaBody.mensaje);
      return [];
    } 
    
    if (respuestaBody?.paises?.length > 0) {
      const paisesArray = respuestaBody.paises.map(p => Pais.parse(p));
      return paisesArray;
    }
    
    return [];
  } catch (error) {
    console.error("Error al obtener países:", error);
    return [];
  }
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
}

//Actividades de la api
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

function eliminarActividad(event) {
  const usuarioLogueadoEliminarActividad = JSON.parse(localStorage.getItem("UsuarioLogueadoApp"));

  // Buscar el ID de la actividad desde el botón
  const idActividad = event.currentTarget.dataset.actividadId;

  if (!idActividad) {
    mostrarToast("ERROR", "Error", "No se encontró la actividad.");
    return;
  }

  const urlApi = `${apiBaseURL}registros.php?idRegistro=${idActividad}`;

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
        if (bodyDeLaRespuesta.codigo == 200) {          
          const idActividadNum = Number(idActividad);
          actividadesCreadas = actividadesCreadas.filter(
            (actividad) => actividad.id !== idActividadNum
          );
          mostrarToast( "SUCCESS", "Éxito", "Actividad eliminada correctamente."
          );
          ObtenerActividadesCreadas();
        }
      })
      .catch((error) => console.log("Error:", error));
  } else {
    mostrarToast("ERROR", "Error", "Por favor, intente nuevamente.");
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
  const usuarioLogueadoActividad = JSON.parse(localStorage.getItem("UsuarioLogueadoApp"));

  let listadoActividades = "<ion-list>";
  actividades.forEach((a) => {
    actividadesCreadas.forEach((ac) => {
      if (usuarioLogueadoActividad.id == ac.idUsuario) {
        listadoActividades += `
          <ion-item class="ion-item-actividad" actividad-id="${ac.id}">
            <div>
              <ion-thumbnail slot="start">
                <img src="${a.getURLImagen()}" width="100" />
              </ion-thumbnail>

              <ion-label>
                <h2>${a.nombre}</h2>
              </ion-label>

              <p>Tiempo: ${ac.tiempo}</p>

              <p>Fecha: ${ac.fecha}</p>

              <ion-button
                color="medium"
                data-actividad-id="${ac.id}"
                class="eliminarActividad"
              >
                <ion-icon slot="icon-only" name="trash-sharp"></ion-icon>
              </ion-button>
            </div>
          </ion-item>
        `;
      }
    });
  });

  listadoActividades += "</ion-list>";

  if (actividadesCreadas.length > 0) {
    document.querySelectorAll(".eliminarActividad").forEach((boton) => {
      boton.addEventListener("click", eliminarActividad);
    });
  } else {
    listadoActividades = "No se encontraron actividades.";
  }

  document.querySelector("#divAct").innerHTML = listadoActividades;

  // Ahora asignamos los eventos después de renderizar el DOM
  document.querySelectorAll(".eliminarActividad").forEach((boton) => {
    boton.addEventListener("click", eliminarActividad);
  });
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
        borrarDatos();
      } else {
        mostrarToast("ERROR", "Error", respuestaBody.mensaje);
      }
    })
    .catch((error) => console.log("Error:", error));
}

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
    if (actividadesActual.id === id) {
      act = actividadesActual;
    }
    i++;
  }
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

function filtrarListadoActividades() {
  let selectorTiempo = document.querySelector("#slcActFiltro").value;
  document.querySelector("#divAct").innerHTML = "";  
  let listado = ""; 

  let fecha = new Date();
  let fechaSemanal = new Date();
  let fechaMensual = new Date(); 

  fechaSemanal.setDate(fecha.getDate() - 7);
  fechaMensual.setDate(fecha.getDate() - 30);


  for (const actividad of actividadesCreadas) {
    let fechaDeActividad = new Date(actividad.fecha);
    let urlImagen = "";
    let nombreActividad = "";


    actividades.forEach((a) => {
      if (actividad.idActividad === a.id) {
        nombreActividad = a.nombre;
        urlImagen = a.getURLImagen();
      }
    });

    if (
      selectorTiempo === "todo" ||
      (selectorTiempo === "semana" && fechaDeActividad >= fechaSemanal) ||
      (selectorTiempo === "mes" && fechaDeActividad >= fechaMensual)
    ) {
      listado += `
        <ion-item class="ion-item-actividad" actividad-id="${actividad.id}">
          <div>
            <ion-thumbnail slot="start">
              <img src="${urlImagen}" width="100" />
            </ion-thumbnail>

            <ion-label>
              <h2>${nombreActividad}</h2>
            </ion-label>
            <p>Tiempo: ${actividad.tiempo}</p>
            <p>Fecha: ${actividad.fecha}</p>
            <ion-button
              color="medium"
              data-actividad-id="${actividad.id}"
              class="eliminarActividad"
            >
              <ion-icon slot="icon-only" name="trash-sharp"></ion-icon>
            </ion-button>
          </div>
        </ion-item>
      `;
    }
  }
  document.querySelector("#divAct").innerHTML = listado;
}

  function cerrarSesionPorFaltaDeToken() {
    mostrarToast(
      "ERROR",
      "No autorizado",
      "Se ha cerrado sesión por seguridad."
    );
    cerrarSesion();
  }

  //Funciones Aux
  function borrarDatos() {
    document.querySelector("#txtLoginMail").value = "";
    document.querySelector("#txtLoginPassword").value = "";
    document.querySelector("#txtTiempoActividad").value = "";
    document.querySelector("#txtFechaActividad").value = "";
    document.querySelector("#txtNombreRegistro").value = "";
    document.querySelector("#txtPasswoedIngresado").value = "";
    document.querySelector("#selectorPaís").value = "";
  }

