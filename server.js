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



import { __dirname } from './utils.js';
import path from 'path';

const WS_PUERTO = parseInt(process.env.WS_PUERTO)||8000;
const PUERTO = parseInt(process.env.PUERTO) || 3000;
const MONGOOSE_URL = 'mongodb+srv://ff:1717@cluster0.mue78ww.mongodb.net/';
const COOKIE_SECRET = 'perritonoah0108'
export const baseUrl = `http://localhost:${PUERTO}`;
export const productsPerPage = 10;

// SERVIDOR EXPRESS y SOCKET.IO INTEGRADO
const app = express();
const server = http.createServer(app);
// Creamos nueva instancia para el servidor socket.io, activando módulo cors con acceso desde cualquier lugar (*)

const httpServer = app.listen(WS_PUERTO, () =>{
  console.log(`Servidor API/Socket.io iniciando en puerto ${WS_PUERTO}`)    
}) 

const io = new Server(httpServer, {
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
export const store = MongoStore.create({ mongoUrl: MONGOOSE_URL, mongoOptions: {}, ttl: 3600});
app.use(session({
    store: store,
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}))

// Endpoint API//
app.use('/api', productRoutes(io));
app.use('/api', routerCart(io));
app.use('/api', userRoutes(io));
app.use('/api', mainRoutes(io, store, baseUrl, productsPerPage));

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
   await mongoose.connect(MONGOOSE_URL,{ useNewUrlParser: true,
    useUnifiedTopology: true,})
   .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });
    app.listen(PUERTO, () => {
        console.log(`Servidor iniciado en puerto ${PUERTO}`);
    });
} catch(err) {
    console.log(`No se puede conectar con el servidor de bbdd (${err.message})`);
}




/*

//PRUEBAS MOONGOOSE
mongoose.connect(MONGOOSE_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });
  
  const collection = 'Products'
  const USERSHEMA = new mongoose.Schema({
    _id: String,
    id : Number,
    title : String,
    description : String,
    price: Number,  
    code : String, 
    stock :  Number
  });
  
  const user = mongoose.model(collection, USERSHEMA);
  
  // Endpoint para verificar la conexión y obtener productos
  app.get('/verificar-db', async (req, res) => {
    try {
      const productos = await user.find();
      res.json(productos);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });
*/

/*PRUEBAS MONGO CLIENT

async function client() {
    try {
      const client = await MongoClient.connect(MONGOOSE_URL);
      console.log('Conexión exitosa a la base de datos');
  
      
  
      client.close(); // Cierra la conexión al finalizar las operaciones
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  }
  
  client();



  app.get('/verificar-db', async (req, res) => {
    try {
      const client = await MongoClient.connect(MONGOOSE_URL);
      console.log('Conexión exitosa a la base de datos');
  
      const collection = client.db('BackendFedericoLopez').collection('users');
      const productos = await collection.find().toArray();
  
      res.json(productos);
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
      res.status(500).json({ error: 'Error al conectar a la base de datos' });
    } finally {
      client().close;
    }
  });*/