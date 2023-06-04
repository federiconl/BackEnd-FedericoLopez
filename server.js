import {} from 'dotenv/config';

import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';



import routerP from './api/products/productsRoutes.js';
import routerCart from './api/cart/cartsRouter.js';

import { __dirname } from './utils.js';

const PUERTO = parseInt(process.env.PUERTO) || 3000;
const WS_PORT = 8000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;
// Servidor Express base
const server = express();
const app = http.createServer(server)
const httpServer = server.listen(WS_PORT, () => {
    console.log(`Servidor socketio iniciado en puerto ${WS_PORT}`);
});

const io = new Server(httpServer, { cors: { origin: "http://localhost:3000" }});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Endpoint API//
server.use('/api', routerP);
server.use('/api', routerCart);

// Contenido static
server.use('/public', express.static(`${__dirname}/public`));

// Motor de plantillas
server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', './views');


// ACTIVACION SERVIDOR GENERAL
try {
    await mongoose.connect(MONGOOSE_URL);
    
    app.listen(PUERTO, () => {
        console.log(`Servidor iniciado en puerto ${PUERTO}`);
    });
} catch(err) {
    console.log(`No se puede conectar con el servidor de bbdd (${err.message})`);
}


//Eventos socket.io
io.on('connection', (socket) => { // Escuchamos el evento connection por nuevas conexiones de clientes
    console.log(`Cliente conectado (${socket.id})`);
    
    // Emitimos el evento server_confirm
    socket.emit('server_confirm', 'Conexión recibida');
    
    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`);
    });
    
    // Escuchamos por el evento evento_cl01 desde el cliente
    socket.on('event_cl01', (data) => {
        console.log(data);
    });
});







