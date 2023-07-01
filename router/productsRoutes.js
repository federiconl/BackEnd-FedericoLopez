import { Router } from 'express';
import ProductManager from '../services/productsManager.js';
import { __dirname } from '../utils.js';



const routerP = Router();
const manager = new ProductManager(); 


const productRoutes = (io) => {    


//handlebars
routerP.get ('/', async (req,res) =>{
    const products = await manager.getProducts();
    res.render ('index', {
        products: products
    })
})

routerP.get ('/realtimeproducts', async (req,res) =>{
    const products = await manager.getProducts();
    res.render ('home', {
        products: products
    })
})



//express
routerP.get('/products', async (req, res) => {
    try {
        const products = await manager.getProducts();
        

        res.status(200).send({ status: 'OK', data: products });

    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
});



routerP.get("/products/:pid", async (req, res) => {
    try {
        const products = await manager.getProducts();
        const productID = products.find(product => product.id === parseInt(req.params.id));
        if (productID) {
            res.status(200).send(producto);
        } else {
            res.status(404).send({ mensaje: 'ERROR: no se encuentra el id' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    };
})

routerP.post('/products', async(req, res) => {
   try {
    await manager.addProduct(req.body);

    if (manager.checkStatus() === 1){
        res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
});
    


routerP.put('/products', async (req, res) => {
    try {
        const { id, field, data } = req.body;
        await manager.updateProduct(id, field, data);
    
        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
});


routerP.delete('/products', async(req, res) => {
    try {
        await manager.deleteProduct(req.body.id);
    
        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
});

return routerP

}

export default productRoutes;