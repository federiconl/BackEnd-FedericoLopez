//import Products from "../services/productsManager.js";
//const manager = new Products();

import factoryProducts from "../services/factoryProducts.js";
import { Faker, en } from '@faker-js/faker';

const faker = new Faker({ locale: [en] })

const manager = new factoryProducts(); 


//Mocking Products
export function generateMockProducts (){
    const mockProducts=[];
    for (let i = 1; i <= 100; i++) {
        const newProduct = {
            id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            rating: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
            stock:faker.number.int(50),
            brand: faker.company.name(),
            category:faker.commerce.department() ,
            thumbnail: faker.image.url(),
            images: faker.image.url(),
        };
        mockProducts.push(newProduct);
      }
      return mockProducts;
}

export const getMockProducts = async (req,res) =>{
    const mockProducts= generateMockProducts();
    res.json(mockProducts)
};
     


//Endpoints
export const getProductsRender = async (req,res) =>{
    try {
        const products = await manager.getProducts();
        res.render('products', {})
        res.status(200).send({ status: 'OK', data: products });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
};

export const getProducts = async (req,res) => {
    try {
        const products = await manager.getProductsPaginated(0,5);
        res.status(200).send({ status: 'OK', data: products });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
};

export const addProduct = async (req,res) =>{
    try {
        await manager.addProduct(req.body);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
};

export const uploadProduct = async (req,res) =>{
    try {
        const { id, field, data } = req.body;
        await manager.updateProduct(id, field, data);
    
        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
};

export const deleteProduct  = async (req,res) =>{
    try {
        await manager.deleteProduct(req.body.id);
    
        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
};
