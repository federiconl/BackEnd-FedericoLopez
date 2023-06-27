import {} from 'dotenv/config';

import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import FileStore  from 'session-file-store';


import routerP from './api/products/productsRoutes.js';
import routerCart from './api/cart/cartsRouter.js';
import userRoutes from './api/users/userRoutes.js';
import mainRoutes from './api/main.routes.js';

import userModel from './api/users/usersModel.js';
import productModel from './api/products/productModel.js';
import cartModel from './api/cart/cartsModel.js';

import { __dirname } from './utils.js';
import path from 'path';

const PUERTO = parseInt(process.env.PUERTO) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;
const COOKIE_SECRET = 'perritonoah0108'
const BASE_URL = `http://localhost:${PUERTO}`;
const PRODUCTS_PER_PAGE = 10;

// SERVIDOR EXPRESS y SOCKET.IO INTEGRADO
const app = express();
const server = http.createServer(app);
// Creamos nueva instancia para el servidor socket.io, activando módulo cors con acceso desde cualquier lugar (*)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    }   
});

// Parseo correcto de urls
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Parseo de cookies
app.use(cookieParser(COOKIE_SECRET));

//manejo sessions
const fileStorage = FileStore(session)
const store = new fileStorage({path: `${__dirname}/sessions`, ttl: 3600, retries : 0})
app.use(session({
    store: store,
    secret : COOKIE_SECRET ,
    resave : false ,
    saveUninitialized : false
}));


// Endpoint API//
app.use('/api', routerP);
app.use('/api', routerCart);
app.use('/api', userRoutes);
app.use('/api', mainRoutes);

// Contenido static
app.use('/public', express.static(`${__dirname}/public`));

// Motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


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







