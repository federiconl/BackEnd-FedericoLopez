const fs = require ('fs')
const express = require('express');

const puerto = 8080;

const server = express();

const products = '../js/productos.json'
const camposRequeridos = [ 'id', 'title', 'description', 'price','thumbnail','code','stock' ];

server.use(express.json);

server.use(express.urlencoded({ extended: true }));
server.listen(puerto, () => {
    console.log(`Servidor express activo en ${puerto}`)
});

server.get("/products", async (req, res) => {
    var limit = req.query.limit
    const productos = await fs.promises.readFile(products,'utf-8');
    const productosJson = await JSON.parse(productos);
    res.send (productosJson + limit)
})
server.get("/products", async (req, res) => {
    const productos = await fs.promises.readFile(products,'utf-8');
    const productosJson = await JSON.parse(productos);
    res.send(productosJson)
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
