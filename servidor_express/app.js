const fs = require ('fs')
const express = require('express');

const puerto = 8080;

const server = express();

const products = '../js/productos.json'
const camposRequeridos = [ 'id', 'title', 'description', 'price','thumbnail','code','stock' ];

server.use(express.json);

server.use(express.urlencoded({ extended: true }));

server.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit) || productosJson.lenght;
  const productos = await fs.promises.readFile(products,'utf-8');
  const productosJson = await JSON.parse(productos);
  const productosFiltrado = db.get("produtosJson").value().slice(0, limit);
  
  
  res.send (productosFiltrado)

})


server.get("/products/:id",async (req, res) => {
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

server.listen(puerto, () => {
      console.log(`Servidor express activo en ${puerto}`)
  });