class Usuario {
  usuario;
  password;
  idPais;
  apiKey;

  static parse(data) {
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
    return usuario;
  }
}

class Actividad {
  id;
  titulo;
  usuario;
  tiempo;
  fecha;

  static parse(data) {
    const actividad = new Actividad();
    if (data._id) {
      producto.id = data._id;
    }
    if (data.titulo) {
      producto.titulo = data.titulo;
    }
    if (data.usuario) {
      producto.usuario = data.usuario;
    }
    if (data.tiempo) {
      producto.tiempo = data.tiempo;
    }
    if (data.fecha) {
      producto.fecha = data.fecha;
    }

    return actividad;
  }
}
