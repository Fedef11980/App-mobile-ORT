class Usuario {
  nombre;
  apellido;
  direccion;
  email;
  token;

  static parse(data) {
    const usuario = new Usuario();
    if (data.nombre) {
      usuario.nombre = data.nombre;
    }
    if (data.apellido) {
      usuario.apellido = data.apellido;
    }
    if (data.direccion) {
      usuario.direccion = data.direccion;
    }
    if (data.email) {
      usuario.email = data.email;
    }
    if (data.token) {
      usuario.token = data.token;
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
