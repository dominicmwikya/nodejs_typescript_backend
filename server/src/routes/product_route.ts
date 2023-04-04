import {Router} from 'express'
import {ProductValidator} from '../middlewares/ValidationSchemas/ProductSchema'
import { ProductController } from '../controllers/product.controller'
     const productRoutes= Router();

     productRoutes.post('/:userId',  ProductValidator,ProductController.CreateProduct);
     productRoutes.get('/', ProductController.getProducts);

export {productRoutes}