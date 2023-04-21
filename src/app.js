const express = require('express')
const routerProd = require ('./routes/products')
const routerCarts = require('./routes/carts')
const app = express();
const port = 8080

const server = express();
server.use(express.json);
server.use(express.urlencoded({ extended: true }));

  

app.use('/api',routerProd);
app.use('api', routerCarts)
app.use('/public', express.static(`${__dirname}/public`))



app.listen(port, () => {
  console.log(`Servidor express activo en puerto ${port}`)
})
