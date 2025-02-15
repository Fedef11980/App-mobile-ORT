class Usuario {
    nombre;
    apellido;
    direccion;
    email;
    token;

    static parse(data){ // un metodo estatico tiene una ventaja
        const usuario= new Usuario()
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
        return usuario
    }
}


class Producto {
    id;
    codigo;
    nombre;
    descripcion;
    precio;
    urlImagen;
    estado;
    etiquetas;
    puntaje;

    static parse(data){
        const producto= new Producto()
        if (data._id) {
            producto.id = data._id;
        }
        if (data.codigo) {
            producto.codigo = data.codigo;
        }
        if (data.nombre) {
            producto.nombre = data.nombre;
        }
        if (data.descripcion) {
            producto.descripcion = data.descripcion;
        }
        if (data.precio) {
            producto.precio = data.precio;
        }
        if (data.urlImagen) {
            producto.urlImagen = data.urlImagen;
        }
        if (data.estado) {
            producto.estado = data.estado;
        }
        if (data.etiquetas) {
            producto.etiquetas = data.etiquetas;
        }
        if (data.puntaje) {
            producto.puntaje = data.puntaje;
        }
        return producto;
    }
    getURLImagen(){
        return 'https://ort-tallermoviles.herokuapp.com/assets/imgs/' + this.urlImagen + '.jpg' 
    }
}

class Sucursal {
    id;
    nombre;
    direccion;
    ciudad;
    pais;

    static parse(data){
        const sucursal = new Sucursal();
        if (data._id) sucursal.id=data._id;            
        if (data.nombre) sucursal.nombre = data.nombre;
        if (data.direccion) {
            sucursal.direccion = data.direccion
        }
        if (data.ciudad) {
            sucursal.ciudad=data.ciudad;            
        }
        if (data.pais) {
            sucursal.pais=data.pais
        }
        return sucursal;
    }
}

class Pedido {
    id;
    cantidad;
    fecha;
    estado;
    total;
    producto; //instancia de productu
    sucursal; //instancia de sucursal
    
    static parse(data){
        const pedido = new Pedido();
        if (data._id) pedido.id = data._id;
        if (data.cantidad) pedido.cantidad = data.cantidad;
        if (data.fecha) pedido.fecha = data.fecha;
        if (data.estado) pedido.estado = data.estado;
        if(data.total) pedido.total = data.total;
        if (data.producto) pedido.producto = Producto.parse(data.producto);
        if(data.sucursal) pedido.sucursal = Sucursal.parse (data.sucursal);
        return pedido;
    }
}