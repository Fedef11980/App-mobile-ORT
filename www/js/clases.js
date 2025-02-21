class Usuario {
  usuario;
  password;
  idPais;
  apiKey;
  id;

  static parse(data) { // un metodo estatico tiene una ventaja
    const usuario = new Usuario();

    if (data?.usuario) {
      usuario.usuario = data.usuario;
    }
    if (data.password) {
      usuario.password = data.password;
    }
    if (data?.idPais) {
      usuario.idPais = data.idPais;
    }
    if (data.apiKey) {
      usuario.apiKey = data.apiKey;
    }
    if (data.id) {
      usuario.id = data.id;
    }
    return usuario;
  }
}

class RegistrarActividad {  
  idActividad;
  idUsuario
  tiempo;
  fecha;
  titulo; 

  static parse(data) {
    const registrarActividad = new RegistrarActividad();
   
    if (data.idActividad) {
      registrarActividad.idActividad = data.idActividad;
    }
    if (data.idUsuario) {
      registrarActividad.idUsuario = data.idUsuario;
    }
    if (data.tiempo) {
      registrarActividad.tiempo = data.tiempo;
    }
    if (data.fecha) {
      registrarActividad.fecha = data.fecha;
    }
    if (data.titulo) {
      registrarActividad.titulo = data.titulo;
    }        
    return registrarActividad;
  }
}

class Actividad {
  id;
  nombre;
  imagen;

  static parse(data) {
    const actividad = new Actividad();
    if (data.id) {
      actividad.id = data.id;
    }
    if (data.nombre) {
      actividad.nombre = data.nombre;
    }
    if (data.imagen) {
      actividad.imagen = data.imagen;
    }
    return actividad;
  }
  getURLImagen() {
    return "https://movetrack.develotion.com/imgs/" + this.imagen + ".png";
  }
}
