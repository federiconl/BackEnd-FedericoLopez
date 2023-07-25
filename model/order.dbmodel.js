import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = 'orders'

const schema = new mongoose.Schema({
    number : Number,
    business : {type: mongoose.SchemaTypes.ObjectId, ref: 'businesses'},
    user: {type: mongoose.SchemaTypes.ObjectId, ref: 'users'},
    products: [],
    totalPrice: Number,
    completed: {type: Boolean, default:false}
})

const orderModel = mongoose.model(collection, schema)


export default orderModel;