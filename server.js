import {} from 'dotenv/config';

import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import productRoutes from './router/productsRoutes.js';
import routerCart from './router/cartsRouter.js';
import userRoutes from './router/userRoutes.js';
import mainRoutes from './router/main.routes.js';

import passport from 'passport';



import { __dirname } from './utils.js';

const PUERTO = parseInt(process.env.PUERTO) || 3000;
const MONGOOSE_URL = 'mongodb://127.0.0.1/BackendFedericoLopez';
const SESSION_SECRET = process.env.SESSION_SECRET;
export const baseUrl = `http://localhost:${PUERTO}`;
export const productsPerPage = 10;

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
app.use(cookieParser(SESSION_SECRET));

//manejo sessions
export const store = MongoStore.create({mongoUrl:MONGOOSE_URL, mongoOptions:{}, ttl: 30});
app.use(session({
    store: store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

//pasport

app.use(passport.initialize());
app.use(passport.session());

// Endpoint API//
app.use('/api', productRoutes(io));
app.use('/api', routerCart(io));
app.use('/api', userRoutes(io));
app.use('/', mainRoutes(io, store, baseUrl, productsPerPage));

// Contenido static
app.use('/public', express.static(`${__dirname}/public`));

// Motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);




//Eventos socket.io
io.on('connection', (socket) => { // Escuchamos el evento connection por nuevas conexiones de clientes
    console.log(`Cliente conectado (${socket.id})`);
    
    // Emitimos el evento server_confirm
    socket.emit('server_confirm', 'Conexión recibida');

    socket.on('new_product_in_cart', (data) => {;
      // io.emit realiza un broadcast (redistribución) a TODOS los clientes, incluyendo el que lo generó
      io.emit('product_added_to_cart', data);
  });
    
    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`);
    });
    
    // Escuchamos por el evento evento_cl01 desde el cliente
    socket.on('event_cl01', (data) => {
        console.log(data);
    });
});

// ACTIVACION SERVIDOR GENERAL
try {
  await mongoose.connect(MONGOOSE_URL);
  
  server.listen(PUERTO, () => {
      console.log(`Servidor iniciado en puerto ${PUERTO}`);
  });
} catch(err) {
  console.log(`No se puede conectar con el servidor de bbdd (${err.message})`);
}





