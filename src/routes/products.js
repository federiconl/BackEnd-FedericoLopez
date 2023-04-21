const express = require('express');
const router = express.Router();
const uploader = require('../multer')
const fs = require("fs");
const products = '../js/productos.json'
const camposRequeridos = ['title', 'description', 'price', 'code', 'stock', 'thumbnail'];

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const Newprod = [];

function validacionProd (data) {
    const {title, description, price, code, stock, status} = data ;

    if (typeof title !== 'string'){
        console.log('Title debe ser un string')
    }
    if (typeof description !== 'string'){
        console.log('Description debe ser un string')
    }
    if (typeof price !== 'number'){
        console.log ('Price debe ser un numero')
    }
    if (typeof code !== 'string'){
        console.log('Code debe ser un string')
    }
    if (typeof stock !== 'number' && stock <= 0){
        console.log ('Stock debe ser un numero mayor o igual a 0')
    }
    if (typeof status !== 'boolean' && status !== true){
        console.log ('status debe ser un booleano y true ')
    }
  
    if (title || description || price || code || stock || status === " " || undefined){
        console.log('Todos los campos son requeridos ')
    }
}

function validate (validation){
    return (req, res, next) => {
        try {
            validation(req.body);

            next();
        }catch(error){
            next(error);
        }
    }
}





router.get("/products", async (req, res) => {
    const productos = await fs.promises.readFile(products, 'utf-8');
    const productosJson = await JSON.parse(productos);
    const limit = parseInt(req.query.limit) || productosJson.lenght;
    const limitProducts = productosJson.slice(0, limit);


    res.send(limitProducts)

})

router.post('/products', uploader.array('file'),validate(validacionProd), (req, res) => {
    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    } = req.body;


    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        return res.status(400).json({
            message: 'Todos los campos son requeridos'
        })
    }
    if (!Array.isArray(thumbnails)) {
        return res.status(400).json({
            message: 'Thumbnails must be an array'
        })
    }
    const id = 99901;
   

    Newprod.push ( req.body)
    res.send ({status : 'producto añadido'})

    
})

router.get("/products/:pid", async (req, res) => {
    try {
        const productos = await fs.promises.readFile(products, 'utf-8');
        const productosJson = await JSON.parse(productos);
        const producto = productosJson.find(product => product.id === parseInt(req.params.id));
        if (producto) {
            res.status(200).send(producto);
        } else {
            res.status(404).send({ mensaje: 'ERROR: no se encuentra el id' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    };
})

router.put('/products/:pid', async (req, res) => {

    const productos = await fs.promises.readFile(products, 'utf-8');
    const productosJson = await JSON.parse(productos);
    const producto = productosJson.find(product => product.id === parseInt(req.params.id));
    const nuevoObjeto = req.body;

  if (!producto) {
    return res.status(404).send(`Product ${pid} not found`);
  }

  const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    } = req.body;

  res.send(nuevoObjeto)
});

router.delete('/products/:id', async(req, res) => {
    const productos = await fs.promises.readFile(products, 'utf-8');
    const productosJson = await JSON.parse(productos);
    const producto = productosJson.find(product => product.id === parseInt(req.params.id));
    producto.delete(req.params.id)
    .then(
      res.status(200).json({product: 'producto eliminado'})
    )
    .catch(
      res.status(500).json({error: 'internal server error'})
    )
})

router.get('/users', (req, res) => {
    res.status(200).send('SISTEMA INICIADO')
})


module.exports = router;