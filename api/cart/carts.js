class CartManager {
    constructor(archivoJSON) {
        this.archivoJSON = archivoJSON;
        this.lastID = 1;
        this.carts = [];
        this.status = 0;
        this.statusMsg = 'inicializado'
    }


    static requireFilds = ['products']

    static #verifyRequiredFields = (obj) => {
        return CartManager.requireFilds.every(field => Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== null)
    }

    static #objEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    #readProductsFromFile = async () => {
        const data = await fs.promises.readFile(this.archivoJson, 'utf-8')
        return data === '' ? [] : JSON.parse(data);
    }

    checkStatus = () => {
        return this.status;
    }

    showStatusMsg = () => {
        return this.statusMsg
    }

    getCarts = async () => {
        try {
            const carts = await this.#readProductsFromFile();
            this.status = 1;
            this.statusMsg = 'Productos recuperados'
            return carts;
        } catch {
            this.status = -1;
            this.statusMsg = `getProducts: ${err}`;
        }

    }

    newCart = async (cart) => {
        try {


            if (!CartManager.#objEmpty(product) && CartManager.#verifyRequiredFields(cart)) {
                this.carts = await this.#readProductsFromFile();

                this.lastId = this.carts[this.carts.length - 1].id;
                this.carts.push({ id: ++this.latestId, ...cart });
                await fs.promises.writeFile(this.archivoJson, JSON.stringify(this.carts));

                this.status = 1;
                this.statusMsg = "Producto registrado en archivo";
            }

        } catch (err) {
            this.status = -1;
            this.statusMsg = `newCart: ${err}`;
        }
    };

    addToCart = async (productId, quantity, cartId) => {
        const cart = this.carts.find(cart => cart.id === cartId);

        if (!cart) {
            throw new Error(`No se encontró un carrito con el ID ${cartId}`);
        }

        const existingProduct = cart.products.find(product => product.id === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            const product = {
                id: productId,
                quantity: quantity
            };

            cart.products.push(product);
            await fs.promises.writeFile(this.archivoJson, JSON.stringify(this.carts));
        }


    }
}

export default CartManager;