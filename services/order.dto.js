export default class OrderDTO {
    constructor(data){
        this.number = Date.now() + Math.floor(Math.random()*1000+1)
        this.business = data.business
        this.user= data.user
        this.products= data.actualOrder.map(product => product.id)
        this.totalPrice = data.actualOrder.reduce((acc,prev)=>{
            acc += prev.price 
            return acc;
        },0);
        this.completed = false
    }
}