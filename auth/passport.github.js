import passport from "passport";
import userModel from "../model/usersModel";
import GithubStrategy from "passport-github2"


const initializeGithuPassport = () =>{
    const githubData = {
            clientID: 'Iv1.9d5e527212b92066',
            clientSecret: 'd86add38be881120acf08e8b54240b2ef37d036d',
            callbackUrl: 'http://localhost:3000/api/sessions/githubcallback'
        };
    
        const verifyAuthGithub = async (accessToken, refreshToken, profile, done) => {
            
            try {
                // console.log(profile);
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
    
       
        passport.use('github', new GithubStrategy(githubData, verifyAuthGithub));
    
       
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
export default initializePassport;