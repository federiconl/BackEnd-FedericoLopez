import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import { addCart, deleteCartProduct, emptyCart, getCarts, updateCart, updateProductQty } from "../controller/carts.controller.js";
import errorsDict from "../utils/dictionary.js";
import customError from "../services/custonError.js";
const router = Router();

const cartsRoutes = (io) => {
    router.get('/carts', getCarts);

    router.get('/carts/:id', async (req, res) => {
        try {
            const carts = await manager.getCartPopulated(req.params.id);
            if (isNaN(req.params.id)) { throw new CustomError(errorsDict.INVALID_TYPE_ERROR) }
            if (!product) {
                return res.status(404).json(customErrorHandler('PRODUCT_NOT_FOUND'));}
           
            res.status(200).send({ status: 'OK', payload: { id: req.params.id } });
            res.status(200).send({ status: 'OK', payload: carts });
        } catch (err) {
            res.status(500).send({ status: 'err', error: err.message });
        }
    })

    router.post('/carts', addCart);

    router.put('/carts/:id',updateCart);

    router.put('/carts/:id/products/:pid/:qty', updateProductQty);

    router.delete('/carts/:id', emptyCart);

    router.delete('/carts/:id/products/:pid', deleteCartProduct);

    return router;
}

export default cartsRoutes;