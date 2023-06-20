import * as Joi from 'joi'
import { Request, Response, NextFunction } from 'express';

const ProductSchema= Joi.object({
    name:Joi.string()
         .required(),
    category:Joi.string()
            .required(),
    min_qty:Joi.number()
           .required(),
    unit:Joi.string()
           .required(),
    qty:Joi.number().integer().min(1),
    description:Joi.string()
               .required(),
 
});


export const ProductValidator=async(req:Request, res:Response, next:NextFunction)=>{
    const {error}= ProductSchema.validate(req.body);
    if(error){
        
        return res.status(400).json({
            error:error.details[0].message,
        })
    }
    next();
}