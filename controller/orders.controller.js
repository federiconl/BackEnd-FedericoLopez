import Order from '../services/order.dao.js';
import Business from '../services/business.dao.js';
import Users from '../services/UsersManager.js';
import OrderDTO from '../services/order.dto.js';

const orderManager = new Order();
const businessManager= new Business();
const userManager = new Users();

export const getOrders = async(req,res)=>{
    const result = await orderManager.getOrders();
    if (!result) return res.status(500).send({ status: 'ERR', error: 'No se pudo recuperar la lista' });
    res.status(200).send({ status: 'OK', result: result });
};

export const getOrderById = async(req,res)=>{
    const {oid} = req.params;
    const result = await orderManager.getOrderById(oid);
    if (!result) return res.status(500).send({ status: 'ERR', error: 'No se pudo recuperar la lista' });
    res.status(200).send({ status: 'OK', result: result });
};

export const createOrder = async(req,res)=>{
    const {user,products, business} = req.body;
    const resultUser = await userManager.getUserById(user);
    const resultBusiness = await businessManager.getBusinessById(business);
    const actualOrder = resultBusiness.products.filter(product=>products.include(product.id));

    const order = new OrderDTO({business,user,actualOrder});
    const orderResult= await orderManager.createOrder(order);
    
    resultUser.order.push(orderResult._id);
    await userManager.updateUser(user, resultUser);

    res.stauts(200).send({stauts:'OK', result: orderResult});
};


export const resolveOrder = async(req,res)=>{
    const {oid} = req.params;
    const order = await orderManager.getOrderById(oid);
    order.completed = req.query.completed;
    await orderManager.resolveOrder(order._id, order);
    res.status(200).send({ status: 'OK', result: 'Order resolved' });
};