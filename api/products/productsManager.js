import fs from 'fs';
import productModel from './productModel.js';

class ProductManager {

    constructor(archivoJson) {
        this.archivoJson = archivoJson;
        this.products = [];
        this.ultimo_id = 1;
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

    #readProductsFromFile = async () => {
        const data = await fs.promises.readFile(this.archivoJson, 'utf-8')
        return data === '' ? [] : JSON.parse (data);
    }

    checkStatus = () =>{
        return this.status;
    }

    showStatusMsg = () => {
        return this.statusMsg
    }
    
    getProducts = async () => {
        try{
        const products = await productModel.find().lean()
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
            if (!ProductManager.#objEmpty(product) && ProductManager.#verifyRequiredFields(product)) {
                this.products = await this.#readProductsFromFile();

                this.latestId = this.products[this.products.length - 1].id;
                this.products.push({ id: ++this.latestId, ...product });
                await fs.promises.writeFile(this.archivoJson, JSON.stringify(this.products));
                
                this.status = 1;
                this.statusMsg = "Producto registrado en archivo";
            } else {
                this.status = -1;
                this.statusMsg = `Faltan campos obligatorios (${ProductManager.requireFilds.join(', ')})`;
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

    updateProduct = async (id, field, data) => {
        try {
            if (id == undefined || field == undefined || data == undefined) {
                this.status = -1;
                this.statusMsg = "Se requiere body con id, field y data";
            } else {
                const products = await this.#readProductsFromFile();
                const index = products.findIndex(product => product.id === id);
    
                if (index === -1) {
                    this.status = -1;
                    this.statusMsg = "ID no encontrado";
                    return;
                }
    
                products[index][field] = data;
                await fs.promises.writeFile(this.archivoJson, JSON.stringify(products));
                this.status = 1;
                this.statusMsg = "Producto actualizado";
            }
        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateProduct: ${err}`;
        }
    }

    deleteProduct = async (id) => {
        try {
            const process = await productModel.deleteOne({ '_id': new mongoose.Types.ObjectId(id) });
            this.status = 1;
            process.deletedCount === 0 ? this.statusMsg = "El ID no existe": this.statusMsg = "Producto borrado";
        } catch (err) {
            this.status = -1;
            this.statusMsg = `deleteProduct: ${err}`;
        }
    }
   

}


export default ProductManager;