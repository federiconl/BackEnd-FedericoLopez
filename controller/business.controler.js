import Business from '../services/business.dao.js'

const manager = new Business();

export const getBusinesses = async (req,res) =>{
    const result= await manager.getBusiness();
    if(!result) return res.status(500).send({status: 'ERR', error: 'No se pudo recuperar la lista' });
    res.status(200).send({status: 'OK', result: result})
};

export const getBusinessById = async (req,res) =>{
    const {bid} = req.params;
    const result = await manager.getBusinessById(bid);
    if(!result) return res.status(500).send({status:'ERR', error : 'No se pudo recuperar el registo'});
    res.status(200).send({status: 'OK', result: result});
}

export const createBusiness = async (req,res) =>{
    const business = req.body;
    const result = await manager.saveBusiness(business);
    if (!result) return res.status(500).send({ status: 'ERR', error: 'No se pudo guardar el registro' });
    res.status(200).send({ status: 'OK', result: result });
}

export const addProduct = async(req,res)=>{
    const {bid} = req.params;
    const product = req.body;
    const business = await manager.getBusinessById(bid);
    business.products.push(product);
    await manager.updateBusiness(business._id, business);
    res.status(200).send({status:'OK', result: 'Updated'})
}