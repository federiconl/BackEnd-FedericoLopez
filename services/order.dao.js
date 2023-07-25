import orderModel from '../model/order.dbmodel.js'

export default class Order {
    getOrders = async () =>{
        try{
            return await orderModel.find().populate('business')
        }catch(err){
            console.log(err.message);
            return null;
        }
    };

    getOrderById = async (id)=>{
        try{
            return await orderModel.findOne({_id: id})
        } catch (err){
            console.log(err.messagge)
            return null;
        }
    };

    createOrder= async (order)=>{
        try{
            return await  orderModel.updateOne({_id:id}, {$set: order})
        }catch(err){
            console.log(err.message);
            return null;
        }
    };
};