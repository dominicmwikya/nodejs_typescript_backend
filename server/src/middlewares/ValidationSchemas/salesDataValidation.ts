import * as Joi from 'joi';
import {Request, Response, NextFunction} from 'express';

const saleSchema = Joi.object({
    sell_date: Joi.string().required(),
    customer_name: Joi.string().required(),
    payment_mode: Joi.string().required(),
    total: Joi.number().required(),
    totalItems: Joi.number().required(),
    amt: Joi.number().required(),
    balance: Joi.number().required(),
    products: Joi.array()
      .items(
        Joi.object({
          id: Joi.number().required(),
          name: Joi.string().required(),
          quantity: Joi.number().min(1).required(),
          price: Joi.number().required(),
          subTotal: Joi.number().required(),
        })
      )
      .required(),
  });
  
  export const salesValidationSchema = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = saleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
  