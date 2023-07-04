import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const PurchaseSchema = Joi.object({
  quantity: Joi.number().positive().required(),
  price: Joi.number().positive().required(),
  subTotal: Joi.number().positive().required(),
}).unknown();

const ProductScema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  purchases: Joi.array().items(PurchaseSchema).required(),
})

const formDataSchema = Joi.object({
  sell_date: Joi.date().required(),
  customer_name: Joi.string().required(),
  payment_mode: Joi.string().required(),
  total: Joi.number().positive().required(),
  totalItems: Joi.number().positive().required(),
  amt: Joi.number().positive().required(),
  balance: Joi.number().positive().required(),
  products: Joi.array().items(ProductScema).required(),
});


export const salesValidationSchema = async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = formDataSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
