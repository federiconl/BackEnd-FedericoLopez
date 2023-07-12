import jwt from "jsonwebtoken";

const JWT_SECRET = 'perritonoah0108'

const generateToken =  (user, expiration) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: expiration });
}

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(403).send({err:'Se requiere autenticación'})

    const token = authHeader.split(' ')[1];
   
    jwt.verify(token, JWT_SECRET, (err, credentials) => {
        // Si hay error es porque el token no es válido o expiró
        if (err) return res.status(403).send({ err: 'Se requiere autenticación' });

        // Si está todo ok, asignamos los datos de usuario y continuamos
        req.user = credentials.user;
        next();
    });

}

export {generateToken, authToken}


