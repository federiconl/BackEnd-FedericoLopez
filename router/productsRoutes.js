import { Router } from "express";
import Products from "../services/productsManager.js";
import { __dirname } from "../utils.js";
import { authentication, authorization } from "../auth/passport.local.js";
const router = Router();
const manager = new Products();

const productRoutes = (io) => {



    router.get('/products',authentication('jwtAuth'),async (req, res) => {
        try {
            const products = await manager.getProducts();
            res.status(200).send({ status: 'OK', data: products });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });
    


    router.post('/products', authentication('jwtAuth'), async (req, res) => {
        try {
            await manager.addProduct(req.body);
    
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });
    
    router.put('/products', authentication('jwtAuth'), async (req, res) => {
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
    
    router.delete('/products', authentication('jwtAuth'), async(req, res) => {
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

    return router;
}

export default productRoutes;