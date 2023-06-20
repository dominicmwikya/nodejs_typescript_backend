import {Router} from 'express'
import {ProductValidator} from '../middlewares/ValidationSchemas/ProductSchema'
import { ProductController } from '../controllers/product.controller'
     const productRoutes= Router();

     productRoutes.post('/:userId',  ProductValidator,ProductController.CreateProduct);
     productRoutes.get('/search', ProductController.getProductsBySearchTerm)
     productRoutes.get('/test', ProductController.testProductPaginate )

 
        productRoutes.get('/:id', ProductController.getEditProduct);
      
        productRoutes.put('/:id', ProductController.updateProduct);
        productRoutes.delete('/:id', ProductController.deletProduct);
        productRoutes.get('/', ProductController.getProducts);
        


export {productRoutes}