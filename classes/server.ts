import express = require('express');
import { SERVER_PORT } from "../global/environment";
import socketIO = require('socket.io');
import http = require('http');
import * as socket from '../sockets/sockets';
 
 export default class Server {
    private static _instance: Server;
    public app: express.Application;
    public port: number;
    public io: socketIO.Server;
    private httpServer: http.Server;
 
     private constructor() {
         this.app = express()
         this.port = SERVER_PORT;
         this.httpServer = new http.Server( this.app );
         this.io = socketIO( this.httpServer );
         this.escucharSockets();
     }

     public static getInstance() {
        return this._instance || (this._instance = new this()) ;
     }

     private escucharSockets() {
         console.log("Escuchando conexiones!!!");
         this.io.on( 'connection' , cliente => {
            //console.log('Cliente Conectado...');
            
            //Conectar cliente
            socket.conectarCliente(cliente, this.io);

            // Configurar usuario
            socket.configurar(cliente, this.io);
            // Desconectar
            socket.desconectar(cliente, this.io);
            // Recibir mensaje
            socket.mensaje(cliente, this.io);
            // Obtener Usuarios
            socket.obtenerUsuarios(cliente, this.io);
         });
     }

     start ( callback: Function ) {
        this.httpServer.listen(this.port, callback);
     }

 }