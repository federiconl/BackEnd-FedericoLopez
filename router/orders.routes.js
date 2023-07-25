import { Router } from "express";
import {getOrders, createOrder, getOrderById, resolveOrder} from "../controller/orders.controller.js"

const orderRoutes = () => {
    const router = Router();

    router.get('/', getOrders);
    router.post('/', createOrder);
    router.get('/:oid', getOrderById);
    router.put('/:oid', resolveOrder);

    return router;
}

export default orderRoutes;