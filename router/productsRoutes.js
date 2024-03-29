import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import { authentication, authorization } from "../auth/passport.local.js";
import { getProducts,deleteProduct,addProduct,uploadProduct, getProductsRender, getMockProducts } from "../controller/product.controller.js";
const router = Router();

const productRoutes = (io) => {

    router.get('/viewproducts', authentication('jwtAuth', getProductsRender))

    router.get('/products',authentication('jwtAuth'), getProducts );

    router.post('/products', authentication('jwtAuth'), addProduct);
    
    router.put('/products', authentication('jwtAuth'), uploadProduct);
    
    router.delete('/products', authentication('jwtAuth'), deleteProduct);

    router.get('/mockingproducts', authentication('jwtAuth'), getMockProducts);
    return router;
}

export default productRoutes;