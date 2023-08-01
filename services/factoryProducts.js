import config from '../utils/config.js';
import MongoSingleton from '../services/mongo.class.js';

import MemProducts from '../services/productsMemory.js';
import ProductsMongo from './productsManager.js';

let factoryProducts;

switch(config.PERSISTENCE){
    case 'memory':
        factoryProducts = MemProducts;
        break;

    case 'mongo':
        MongoSingleton.getInstance();
        factoryProducts = ProductsMongo;
        break;

    default:
    
}

export default factoryProducts;