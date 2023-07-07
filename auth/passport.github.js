import passport from "passport";
import GithubStrategy from 'passport-github2';
import userModel from "../model/usersModel.js";

const initializePassportGithub = () => {
    const githubData = {
        clientID: 'Iv1.9d5e527212b92066',
        clientSecret: 'd86add38be881120acf08e8b54240b2ef37d036d',
        callbackUrl: 'http://localhost:3000/api/sessions/githubcallback'
    };

    const verifyAuthGithub = async (accessToken, refreshToken, profile, done) => {
        // Así como la estrategia local de passport opera con usuario y clave, la de
        // Github trabaja con un profile (perfil) devuelto por Github luego del proceso
        // de autenticación, con la cual podemos cotejar contra nuestros propios datos
        // y tomar también los que necesitmos para actualizar nuestra bbdd o mostrar.
        try {
            console.log(profile);
            const user = await userModel.findOne({ userName: profile._json.email });

            if (!user) {
                // const [first, last] = fullName.split(' ');
                // El callback done es el mecanismo utilizado por passport para retornar
                // la respuesta de la autenticación
                done(null, false);
            } else {
                done(null, user);
            }
        } catch (err) {
            return done(err.message);
        }
    }

    // Generamos una nueva estrategia GithubStrategy, con el nombre github
    // utilizando los datos y el callback configurados arriba
    passport.use('github', new GithubStrategy(githubData, verifyAuthGithub));

    // Recordar que passport necesita esta configuración de serializeUser
    // y deserializeUser para gestionar correctamente el pasaje de datos a session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err.message);
        }
    });
}

export default initializePassportGithub;