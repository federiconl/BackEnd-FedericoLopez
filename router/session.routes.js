import { Router } from "express";
import passport from "passport";
import initializePassport from "../auth/passport.github";

initializePassport();

const sessionRouter = () => {
    
}