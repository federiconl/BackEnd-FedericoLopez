const errorsDict = {
    ROUTING_ERROR: { code: 404, msg: 'No se encuentra el endpoint solicitado' },
    INVALID_TYPE_ERROR: { code: 400, msg: 'No corresponde el tipo de dato' },
    DATABASE_ERROR: { code: 500, msg: 'No se puede conectar a la base de datos' },
    INTERNAL_ERROR: { code: 500, msg: 'Error interno de ejecución del servidor' },
    PRODUCT_NOT_FOUND: 'Producto no encontrado',
    PRODUCT_ADD_ERROR: 'Error al agregar el producto al carrito'
}

export default errorsDict