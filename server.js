import express from 'express';
import routerP from './api/products/productsRoutes.js';
import routerCart from './api/cart/carts.js';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';


const PUERTO = 3000;
const WS_PORT = 8080;

// Servidor Express base
const server = express();
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



server.listen(PUERTO, () => {
    console.log(`Servidor base API/static iniciado en puerto ${PUERTO}`);
});


