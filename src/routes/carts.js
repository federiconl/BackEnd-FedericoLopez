
const express = require('express');

const router = express.Router();

carts = [];

router.post('/', (req, res) => {
    const { id, products } = req.body
    res.send ('Nuevo cart creado')

    const cart = {
        id: cartId + 1,
        products: products,
    };
    cartId++;
    carts.push(cart);
    return cart;





})

router.get("/:cid", (req, res) => {

    const products_cart = products.filter(
        product => product.cart_id === req.params.cid
    );
    res.json(products_cart);
});



router.post('/:cid/product/:pid', (req, res) => {

    var cid = req.params.cid;
    var pid = req.params.pid;
    var cart = Cart.get(cid);
    var prod = Product.get(pid);
  
    if (cart.products.length === 0) {
      var prod = {product: pid, quantity: 1}
      cart.products.push(prod);
    }
    else {
      var exist = false;
      for (var i = 0; i < cart.products.length; i++) {
        if (cart.products[i].product === pid) {
          cart.products[i].quantity += 1;
          exist = true;
        }
      }
      if (exist === false) {
        var prod = {product: pid, quantity: 1}
        cart.products.push(prod);
      }
    }
  
    res.send(cart.products);
  
  })

router.get('/', (req, res) => {
    res.status(200).send('SISTEMA INICIADO')
})


module.exports = router;

