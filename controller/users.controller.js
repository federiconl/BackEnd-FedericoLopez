import Users from "../services/UsersManager.js";

const manager = new Users();

export const getUsers = async (req,res) => {
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
};

export const addUser = async (req,res) => {

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
};

export const updateUser = async (req,res) => {
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
}

export const deleteUser = async (req,res) =>{
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
}