import { Router } from "express";
import Users from "../services/UsersManager.js";
import { __dirname } from "../utils.js";
import { authentication, authorization } from "../auth/passport.local.js";
// Exportamos todo el paquete de endpoints como función (userRoutes) que toma un argumento (io)
// de esta manera al importarlo en server, podremos "inyectar" io para emitir eventos desde aquí
const userRoutes = (io) => {
    const router = Router();
    const manager = new Users();
    // const manager = new Users(`${__dirname}/data/users.json`);

    
       
    router.get('/users/:id?',authentication('jwtAuth'),  async (req, res) => { // ? indica que el parámetro es opcional
        try {
            if (req.params.id === undefined) {
                const users = await manager.getUsers();
                res.status(200).send({ status: 'OK', data: users });
            } else {
                const user = await manager.getUserById(req.params.id);
                res.status(200).send({ status: 'OK', data: user });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: 'No se encuentra el usuario' });
        }
    });
    
    router.post('/users', authentication('jwtAuth'), authorization('admin'),async (req, res) => {
        try {
            await manager.addUser(req.body);
            // Al haber "inyectado" io, podemos emitir eventos sin problemas al socket
            io.emit('new_user', req.body);
    
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({ status: 'ERR', error: 'No se puede agregar el usuario' });
        }
    });
    
    router.put('/users/:id', authentication('jwtAuth'), async (req, res) => {
        try {
            await manager.updateUser(req.params.id, req.body);
        
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: 'No se puede actualizar el usuario' });
        }
    });
    
    router.delete('/users/:id', authentication('jwtAuth'), async(req, res) => {
        try {
            await manager.deleteUser(req.params.id);
        
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });

    return router;
}

export default userRoutes;