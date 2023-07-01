import mongoose from 'mongoose';
import productModel from '../model/productModel.js';

class ProductManager {

    constructor() {
        this.status = 0;
        this.statusMsg = 'inicializado'
        
    }

    static requireFilds = ['title','description', 'price', 'thumbnail', 'code', 'stock']

    static #verifyRequiredFields = (obj) => {
        return ProductManager.requireFilds.every (field => Object.prototype.hasOwnProperty.call(obj,field) && obj[field] !== null )
    }

    static #objEmpty (obj) {
        return Object.keys(obj).length === 0;
    }

    checkStatus = () =>{
        return this.status;
    }

    showStatusMsg = () => {
        return this.statusMsg
    }

    readProducts = async () => {
        const carts = await productModel.find();
        return carts;
    }

    exist = async (id) => {
        let carts = await this.readProducts(id);
        return carts.find(cart => cart.id === id)
    }

    getProducts = async () => {
        try{
        const products = await productModel.find()
        this.status = 1;
        this.statusMsg = 'Productos recuperados'
        return products;
     }  catch{
            this.status = -1;
            this.statusMsg = `getProducts: ${err}`;
        }
      
    }

    addProduct = async (product) => {
        try {
            if (!Products.#objEmpty(product) && Products.#verifyRequiredFields(product)) {
                await productModel.create(product);           
                this.status = 1;
                this.statusMsg = "Producto registrado en bbdd";      
            } else {
                this.status = -1;
                this.statusMsg = `Faltan campos obligatorios (${Products.requiredFields.join(', ')})`;
            }
        } catch (err) {
            this.status = -1;
            this.statusMsg = `AddProduct: ${err}`;
        }
    }


    getProductById = async(id) => {
        try{
        this.status = 1;
        const product = productModel.findById(id)
        if (product)  return (product);
        }catch(err){
            this.status = -1;
            this.statusMsg = `getProductById: ${err}`;
        }
    
    }

    updateProduct = async (req, res) => {
        try {
                const pid = req.params.pid
                const data = req.body
                console.log("esti es data", data)
                console.log(pid)
                const process = await productModel.updateOne({ '_id': new mongoose.Types.ObjectId(pid) }, data);
                this.status = 1;
                process.modifiedCount === 0 ? this.statusMsg = "El ID no existe o no hay cambios por realizar": this.statusMsg = "Producto actualizado";                
            }            
        catch (err) {
            this.status = -1;
            this.statusMsg = `updateProduct: ${err}`;
        }
    }

    deleteProduct = async (id) => {
        try {
            const id = req.body            
            const process = await productModel.deleteOne({ '_id': new mongoose.Types.ObjectId(id.id)});
            console.log(process) 
        } catch (err) {
            this.status = -1;
            this.statusMsg = `deleteProduct: ${err}`;
        }
    }
   

}


export default ProductManager;