class ProductManager {
    static ultimo_id = 0;
    fs = require ('fs');
   

    constructor(archivoJson) {
        this.archivoJson = archivoJson;
        this.Products = [];
        
    }

    getProducts = async () => {
        const listaProductos = await fs.promises.readFile(this.archivoJson, 'utf-8');
        const listaProductosJson = JSON.parse(listaProductos);
        console.log(listaProductosJson)
      
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

    getProductById = async(id) => {
        const productos = await fs.promises.readFile(this.archivoJson,'utf-8');
        const productosJson = await JSON.parse(productos);
        
        const getProductById = productosJson.filter(product => product.id === id)

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
manager.addProduct('Cuaderno', 'Donde anotar todo lo que necesitas', 135, "./img/cuaderno.jpg", "AXX3",44)
manager.addProduct('Lapicera', 'Para escribir', 40, "./img/Lapicera.jpg", "AXX4",122)
manager.addProduct('Resaltador', 'Para subrayar tus apuntes', 55 , "./img/Resaltador.jpg", "AXX5",17)
manager.addProduct('Tinta', 'Para recargar tus fibrones',48 , "./img/Tinta.jpg", "AXX6",99)
manager.addProduct('Hojas', 'Para llenar tus carpetas ',15 , "./img/Hojas.jpg", "AXX7",74)
manager.addProduct('Carpeta', 'Para guardar tus apuntes', 100 , "./img/Carpeta.jpg", "AXX8",85)
manager.addProduct('Cartuchera', 'Para guardar tus utiles', 150, "./img/Cartuchera.jpg", "AXX9",44)
manager.addProduct('Fibron', 'Para escribir ', 60, "./img/Fibron.jpg", "AXX10",74)

