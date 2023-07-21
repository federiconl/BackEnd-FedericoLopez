import mongoose from 'mongoose';

mongoose.pluralize(null); 
const collection = 'carts';

const schema = new mongoose.Schema({
    created_at: Date,
    updated_at: Date,
    products: [
        {
            pid: { type: mongoose.Schema.Types.ObjectId },
            qty: Number
        }
    ]
});
schema.pre('save', function (next) {
    this.created_at = new Date();
    next();
});
schema.pre('update', function (next) {
    this.update({}, { $set: { updated_at: new Date() } });
    next();
});


const cartModel = mongoose.model(collection, schema);

export default cartModel;