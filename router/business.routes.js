import { Router } from "express";
import {getBusinesses , getBusinessById, addProduct, createBusiness} from '../controller/business.controler.js'

const businessRoutes = () =>{
    const router = Router();

    router.get('/', getBusinesses);
    router.post('/', createBusiness);
    router.get('/:bid', getBusinessById);
    router.post('/:bid/product', addProduct);

    return router;
} 

export default businessRoutes;