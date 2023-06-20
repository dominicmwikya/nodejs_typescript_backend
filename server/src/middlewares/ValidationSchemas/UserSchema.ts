import * as Joi from 'joi';
import {Request, Response, NextFunction} from 'express'
 const RegisterSchema = Joi.object({
    firstName: Joi.string()
        .required(),
    lastName: Joi.string()
        .required(),
    email: Joi.string()
        .email()
        .required(),
    roleId:Joi.number()
          .required(),
    password: Joi.string()
          .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+\$"))
          .required(),
    confirmPassword: Joi.string()
          .valid(Joi.ref('password'))
          .required()
          .messages({ 'any.only': 'Passwords do not match' })
});

 export const joiValidate= async(req:Request, res:Response,next:NextFunction)=>{
    const {error}=RegisterSchema.validate(req.body);
    if(error){
        
        return res.status(400).send(error.details[0].message);
    }
    next();
}


const LoginSchema=Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string().required(),
});


export const joiValidateLogin= async(req:Request, res:Response,next:NextFunction)=>{
    const {error}=LoginSchema.validate(req.body);
    if(error){
        
        return res.status(400).send(error.details[0].message);
    }
    next();
}