import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuariosLista } from "../classes/usuarios-lista";
import { Usuario } from "../classes/usuario";

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = (cliente: Socket, io: SocketIO.Server) => {
    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregarUsuario(usuario);

    io.emit('usuarios-activos', usuariosConectados.getLista());
};

export const desconectar = (cliente: Socket, io: SocketIO.Server) => {
    cliente.on('disconnect', ()=>{
        console.log('Cliente desconectado...');
        usuariosConectados.borrarUsuario(cliente.id);
    });
}

// Escuchar Mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: {de: string, cuerpo: string })=>{
        console.log('Mensaje recibido' , payload);

        io.emit('mensaje-nuevo', payload);
    });
}

// Configurar nuevo cliente
export const configurar = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('configurar-usuario', (payload: { nombre: string }, callback: Function)=> {
        //console.log( 'Configurando usuario:' , payload.nombre );
        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );
        io.emit('usuarios-activos', usuariosConectados.getLista());
        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre} configurado`
        });
    });
}

// Obtener usuarios
export const obtenerUsuarios = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('obtener-usuarios', ()=> {
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
        console.log(`Enviando lista a ${cliente.id}`);        
    });
}