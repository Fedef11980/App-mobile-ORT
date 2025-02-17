class Usuario {
  usuario;
  password;
  idPais;
  apiKey;
  id;

  static parse(data) {
    // un metodo estatico tiene una ventaja
    const usuario = new Usuario();
    if (data.usuario) {
      usuario.usuario = data.usuario;
    }
    if (data.password) {
      usuario.password = data.password;
    }
    if (data.idPais) {
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
  id;
  titulo;
  usuario;
  tiempo;
  fecha;

  static parse(data) {
    const registrarActividad = new RegistrarActividad();
    if (data._id) {
      registrarActividad.id = data._id;
    }
    if (data.titulo) {
      registrarActividad.titulo = data.titulo;
    }
    if (data.usuario) {
      registrarActividad.usuario = data.usuario;
    }
    if (data.tiempo) {
      registrarActividad.tiempo = data.tiempo;
    }
    if (data.fecha) {
      registrarActividad.fecha = data.fecha;
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
    if (data._id) {
      actividad.id = data._id;
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
    return "https://movetrack.develotion.com/imgs/" + this.imagen + ".jpg";
  }
}
