class ProductManager {
    static ultimo_id = 0;
    
    constructor (){
        this.Products = [];
    }
    
    getProducts() {
        console.log(this.Products)
    }
    
    addProduct( title, description, price, thumbnail, code, stock){
    ProductManager.ultimo_id = ProductManager.ultimo_id + 1;
    
    const newPoduct = {
        id: ProductManager.ultimo_id,
        title : title,
        description : description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock
    }
    this.Products.push(newPoduct)
    }

    
    
}

//agregar y mostrar productos//
const manager = new ProductManager();
manager.addProduct('Lapiz','Para escribir',25,"./img/lapiz.jpg",'AXA1',45 );
manager.addProduct('Borrador','Para Borrar', 15, "./img/borrador.jpg", 'AXX2', 57)
manager.addProduct('Cuaderno', 'Donde anotar todo lo que necesitas', 135, "./img/cuaderno.jpg", "AAWQ3")
manager.getProducts();

// filtrado por ID//
const idBuscado = parseInt( 2 );
const getProductById = manager.Products.filter(product => product.id === idBuscado)

if (getProductById.length === 0 ){
    console.log( " No hay ningun producto con este ID ")
} else {
    console.log( getProductById )
}

//Actualizar al array//

const updateProduct = manager.Products.map (product => {
    if (product.id === 1){
        product.price = 15 ;
        product.stock = 10 ;
    }
    return product
} )

console.log(updateProduct)

// Eliminar un producto//

const idToDelete = parseInt(2);

const newArray = manager.Products.filter(product => product.id !== idToDelete)

console.log (newArray);