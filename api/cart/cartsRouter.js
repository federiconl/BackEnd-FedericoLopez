import { Router } from "express";
import CartManager from "./carts.js";
import { __dirname } from "../../utils.js";


const routerCart = Router();

const manager = new CartManager(`${__dirname}/data/carritos.json`); 

routerCart.post('/', async(req, res) => {
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

routerCart.get("/carts/:cid/product/:pid", async (req, res) => {
  try {
      const carts = await manager.getCarts();
      const cartsID = carts.find(cart => cart.id === parseInt(req.params.id));
      if (cartsID) {
          res.status(200).send(carrito);
      } else {
          res.status(404).send({ mensaje: 'ERROR: no se encuentra el id' });
      }
  } catch (err) {
      console.log(err);
      res.status(500).send(err);
  };
})




routerCart.get('/', (req, res) => {
    res.status(200).send('SISTEMA INICIADO')
})


export default routerCart;
