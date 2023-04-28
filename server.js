import  express  from 'express';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
//import routerCart from './api/cart/carts.js';
//import routerP from './api/products/productsRoutes.js';



const app = express();
const port = 8080

const server = express();
server.use(express.json);
server.use(express.urlencoded({ extended: true }));


server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', './views');
/*app.use('/api',routerP);
app.use('api', routerCart)
app.use('/public', express.static(`${__dirname}/public`))*/

server.get('/', (req,res) =>{
  res.render ('index')
})


app.listen(port, () => {
  console.log(`Servidor express activo en puerto ${port}`)
})
