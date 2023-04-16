const express = require('express')
const app = express()
const port = 8080
const fs = require("fs")
const server = express();
server.use(express.json);

const products = '../js/productos.json'
server.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
    const productos = await fs.promises.readFile(products,'utf-8');
    const productosJson = await JSON.parse(productos);
    const limit = parseInt(req.query.limit) || productosJson.lenght;
    const limitProducts = productosJson.slice(0,limit)

 
    res.send (limitProducts)

})

app.get("/products/:id",async (req, res) => {
    try {
      const productos = await fs.promises.readFile(products, 'utf-8');
      const productosJson = await JSON.parse(productos);
      const producto = productosJson.find(product => product.id === parseInt(req.params.id));
      if (producto) {
        res.status(200).send(producto);
      } else {
        res.status(404).send({ mensaje: 'ERROR: no se encuentra el id' });
      }
    } catch(err) {
      console.log(err);
      res.status(500).send(err);
    };
})
  






app.listen(port, () => {
  console.log(`Servidor express activo en puerto ${port}`)
})
