import {} from 'dotenv/config';

import http from 'http';
import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import productRoutes from './router/productsRoutes.js';
import routerCart from './router/cartsRouter.js';
import userRoutes from './router/userRoutes.js';
import mainRoutes from './router/main.routes.js';

import MongoSingleton from './services/mongo.class.js';
import initializePassportGithub from './auth/passport.github.js'
import { initializePassport , initPassport } from './auth/passport.local.js';


import { __dirname } from './utils.js';
import sessionRoutes_gh from './router/session.router.github.js';
import config from './config.js'

const SESSION_SECRET = 'perritonoah0108';
export const baseUrl = `http://localhost:${config.SERVER_PORT}`;
export const productsPerPage = 10;

// SERVIDOR EXPRESS y SOCKET.IO INTEGRADO
const app = express();
const server = http.createServer(app);
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
export const store = MongoStore.create({mongoUrl:config.MONGOOSE_URL, mongoOptions:{}, ttl: 30});
app.use(session({
    store: store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

//pasport
initializePassportGithub();
initializePassport();
initPassport();

// Endpoint API//
app.use('/api', productRoutes(io));
app.use('/api', routerCart(io));
app.use('/api', userRoutes(io));
app.use('/', mainRoutes(io, store, baseUrl, productsPerPage));
app.use('/api/sessions', sessionRoutes_gh());

// Contenido static
app.use('/public', express.static(`${__dirname}/public`));

// Motor de plantillas
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);




//Eventos socket.io
io.on('connection', (socket) => { 
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
  //MongoSingleton.getInstance();

  app.listen(config.SERVER_PORT, () => {
      console.log(`Servidor iniciado en puerto ${config.SERVER_PORT}`);
  });
} catch(err) {
  console.log(`No se puede iniciar el servidor (${err.message})`);
}



