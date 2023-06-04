import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


mongoose.pluralize(null); // Importante! para no tener problemas con Mongoose
const collectionProducts = 'products';

const schemaProducts = new mongoose.Schema({
    _id: String,
    id : Number,
    title : String,
    description : String,
    price: Number,  
    code : String, 
    stock :  Number
});
schemaProducts.plugin(mongoosePaginate);
const productModel = mongoose.model(collectionProducts,schemaProducts);

export default productModel;