import { Router } from "express";
import express from 'express'
import {UserController} from '../controllers/user.controller';
import {joiValidate, joiValidateLogin} from '../middlewares/ValidationSchemas/UserSchema'
import {authGuard} from '../middlewares/Guards/authGuard'
import { authPermission } from "../middlewares/userPermissions";
const userRoutes:Router=express.Router();

userRoutes.get('/', UserController.getUsers);
userRoutes.get('/test', UserController.testProductPaginate)
userRoutes.post('/create', joiValidate, UserController.registerNewUser);
userRoutes.post('/login', joiValidateLogin,UserController.loginUser);
userRoutes.get('/verify/:uniquestring', UserController.verifyUserCode);

userRoutes.get('/protected-route', authGuard.verifyUserToken, (req:any, res) => {
        const user = req.user;
        res.status(200).json({
            usermail:user.payload.email,
            name:user.payload.name,
            id:user.payload.id,
            role:user.payload.role,
            authStatus:true,
            message:`user is Authenticated`
        })
})
export {userRoutes}