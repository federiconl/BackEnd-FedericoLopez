import { Router } from "express";
import { __dirname } from "../utils.js";
import { authentication, authorization } from "../auth/passport.local.js";
import { addUser, deleteUser, getUsers, updateUser } from "../controller/users.controller.js";

const userRoutes = (io) => {
    const router = Router();

    router.get('/users/:id?',authentication('jwtAuth'), getUsers);
    
    router.post('/users', authentication('jwtAuth'), authorization('admin'),addUser);
    
    router.put('/users/:id', authentication('jwtAuth'), updateUser);
    
    router.delete('/users/:id', authentication('jwtAuth'), deleteUser);

    return router;
}

export default userRoutes;