import passport from 'passport';
import LocalStrategy from 'passport-local';
import userModel from '../model/usersModel.js';
import jwt from 'passport-jwt'

// Estrategia JWT
const JWTStrategy = jwt.Strategy;
const JWTExtractor = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    if (req && req.cookies) {
        return req.cookies['login_token'];
    }

    return null;
}

const jwtData = {

    jwtFromRequest: JWTExtractor.fromExtractors([cookieExtractor]),
    secretOrKey: 'perritonoah0108' 
}

const verify = async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload);
    } catch(err) {
        return done(err.message);
    }
};

const initPassport = () => {
    passport.use('jwtAuth', new JWTStrategy(jwtData, verify));
}


// Middleware de autenticación detallada
const authentication = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}
// Middleware de autorización
const authorization = (role) => {
    return async(req, res, next) => {
        if (!req.user) return res.status(401).send({ error: 'Unauthorized' });
        if (req.user.role != 'admin' && req.user.role != role) return res.status(403).send({ error: 'No permissions' });
        next();
    }
}

const verifyAuthRegistration = async (userName, password, done) => {
    try {
        const user = await userModel.findOne({userName: userName });

        if (user === null) {
            
            return done(null, { _id: 0 });
        } else {
            return done(null, false, { message: 'El email ya se encuentra registrado' });
        }
    } catch(err) {
        return done(err.message);
    }
};

passport.use('authRegistration', new LocalStrategy({ userNameField: 'userName', passwordField: 'password' }, verifyAuthRegistration));
const initializePassport = () =>{
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
export {passport , initializePassport, authentication, authorization, initPassport};