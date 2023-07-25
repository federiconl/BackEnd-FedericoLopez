import mongoose from "mongoose";

mongoose.pluralize(null);

const collection= 'business '

const schema = ({
    name:String,
    products: []
});

const businessesModel = mongoose.model(collection,schema);

export default businessesModel;