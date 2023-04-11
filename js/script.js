const fs = require ('fs');


class ProductManager {
    static ultimo_id = 0;
    fs = require ('fs');
    archivo = "../Data"

    constructor(archivoJson) {
        this.archivoJson = archivoJson;
        this.Products = [];
        
    }

    getProducts() {
        console.log(this.Products)
      
    }

    addProduct = async(title, description, price, thumbnail, code, stock) => {
        ProductManager.ultimo_id = ProductManager.ultimo_id + 1;

        const newPoduct = {
            id: ProductManager.ultimo_id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }
        this.Products.push(newPoduct)


        await fs.promises.writeFile(this.archivoJson, JSON.stringify(this.Products))
    }

    getProductById(id) {
        const getProductById = this.Products.filter(product => product.id === id)

        if (getProductById.length === 0) {
            console.log(" No hay ningun producto con este ID ")
        }
        else {
            console.log(getProductById)
        }
    }

    updateProduct(id,prop, newValue ) {
       const findElement = this.Products.findIndex ((product)=>{
        return product.id === id
       });

       this.Products[findElement][prop] = newValue;

       console.log (this.Products)


    }


    deleteProduct(id) {
        const newArray = this.Products.filter(product => product.id !== id)

        console.log(newArray);
    }



   

}


//agregar y mostrar productos//
const manager = new ProductManager('./productos.json');
manager.addProduct('Lapiz', 'Para escribir', 25, "./img/lapiz.jpg", 'AXA1', 45);
manager.addProduct('Borrador', 'Para Borrar', 15, "./img/borrador.jpg", 'AXX2', 57)
manager.addProduct('Cuaderno', 'Donde anotar todo lo que necesitas', 135, "./img/cuaderno.jpg", "AAWQ3")
manager.getProductById(3);
manager.getProducts();
manager.deleteProduct(2);
manager.updateProduct(1,"title", "Pencil")

