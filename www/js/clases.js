class Usuario {
  usuario;
  password;
  idPais;
  apiKey;
  id;

  static parse(data) {
    // un metodo estatico tiene una ventaja
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
  id;
  idActividad;
  idUsuario;
  tiempo;
  fecha;

  static parse(data) {
    const registrarActividad = new RegistrarActividad();
    if (data.id) {
      registrarActividad.id = data.id;
    }
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

class Pais {
  id;
  name;
  currency;
  latitude;
  longitude;

  static parse(data) {
    const pais = new Pais();
    if (data.id) {
      pais.id = data.id;
    }
    if (data.name) {
      pais.name = data.name;
    }
    if (data.currency) {
      pais.currency = data.currency;
    }
    if (data.latitude) {
      pais.latitude = data.latitude;
    }
    if (data.longitude) {
      pais.longitude = data.longitude;
    }
    return pais;
  }
}


