import { Router } from "express";
import userModel from "../model/usersModel.js";
import { createHash, isValidPassword } from "../utils.js";
import {passport, authentication,authorization} from "../auth/passport.local.js"
import { store,productsPerPage,baseUrl } from "../server.js";
import { authToken, generateToken } from "../auth/jwt.config.js";


const mainRoutes = (io, store, productsPerPage,baseUrl) => {    
    const router = Router();
    //vistas
    router.get('/', async (req, res) => {
        const authenticated = req.headers.authorization ? true : false;
        res.render('products', { authenticated: authenticated });
    });

    router.get('/private', authToken, async (req, res) => {
        res.status(200).send({ status: 'OK', data: 'Credenciales autorizadas para visualizar contenido privado' });
    });

    router.get('/login', async (req, res) => {
        res.render('login', {});
    });
    

    router.get('/pg', async (req,res) => {
        res.render('private_general', {});
    });

    router.get('/ae', async (req, res) => {
        res.render('authentication_err', {});
    });

    router.get('/register', async (req, res) => {
        res.render('registration', {});
    });

    router.post('/login', async (req, res) => {
        req.sessionStore.userValidated = false;
        const { login_email, login_password } = req.body; // 

        const user = await userModel.findOne({ userName: login_email });

        if (!user) {
            req.sessionStore.errorMessage = 'No se encuentra el usuario';
            res.redirect('/login');
        } else{
             if (!isValidPassword(user, login_password)) {
            req.sessionStore.errorMessage = 'Clave incorrecta';
            res.redirect('/login');
        
        } else {
            const date = new Date();

            const userdataForToken = { firstName: user.firstName, lastName: user.lastName, userName: user.userName, role: 'normal_user' };
            
            const token = generateToken(userdataForToken, '24h');

            res.cookie('login_token', token, {
                maxAge: date.setDate(date.getDate() + 1),
                secure: false, // true para operar solo sobre HTTPS
                httpOnly: true
            }).send({ status: 'Usuario autenticado y token generado' });

        }
    }
    });
    
     router.get('/current', authentication('jwtAuth'), authorization('normal_user'), async (req, res) => {
         res.send({ status: 'OK', data: req.user });
     });

    router.get('/logout', async (req, res) => {
        res.clearCookie('login_token');
        res.redirect('/login');
    });


    router.get('/regfail', async (req, res) => {
        res.render('registration_err', {});
    });

    // Solo incluímos passport desde el archivo de estrategias y realizamos la llamada al middleware de autenticación
    // En caso de existir ya el mail en bbdd, redireccionará a /regfail, sino permitirá continuar con /register
    router.post('/register',passport.authenticate('authRegistration', { failureRedirect: '/regfail' }), async (req, res) => {
        const { firstName, lastName, userName, password } = req.body; // Desestructuramos los elementos del body
        if (!firstName || !lastName || !userName || !password ) res.status(400).send('Faltan campos obligatorios en el body');
        const newUser = { firstName: firstName, lastName: lastName, userName: userName, password:createHash(password)};
        
        const process = userModel.create(newUser);
        console.log(newUser)
        res.status(200).send({ message: 'Todo ok para cargar el usuario', data: process });
    });

    return router;
}

export default mainRoutes;