import Carts from "../services/carts.js";

const manager = new Carts();

export const getCarts = async (req,res) => {
    try {
        const carts = await manager.getCarts();
        res.status(200).send({ status: 'OK', data: carts });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
}

export const addCart = async (req,res) =>{
    try {
        const products_array = req.body;
        if (!Array.isArray(products_array.products)) {
            res.status(400).send({ status: 'ERR', message: 'El body debe contener un array products con al menos un producto' });
        } else {
            const process = await manager.addCart(products_array);
            res.status(200).send({ status: 'OK', data: process });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
};

export const updateCart = async (req,res)=>{
    try {
        const product = req.body;
        await manager.updateCart(req.params.id, product);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Producto agregado al carrito' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo agregar el producto al carrito.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }

}

export const updateProductQty = async (req,res)=>{
    try {
        await manager.updateProductQty(req.params.id, req.params.pid, req.params.qty);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Cantidad de producto actualizada' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo actualizar cantidad de producto.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
    
    
    try {
        const updateProductQty = await manager.updateProductQty(req.params.cid, req.params.pid, req.body)
        res.status(200).send(updateProductQty)


    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err })
    }
}

export const emptyCart = async (req,res)=>{
    try {
        await manager.emptyCart(req.params.id);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Carrito Vaciado' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo vaciar el carrito.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
};

export const deleteCartProduct = async (req,res) => {
    try {
        await manager.deleteCartProduct(req.params.id, req.params.pid);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Producto quitado del carrito' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo quitar el producto en el carrito.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
}
