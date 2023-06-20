import{Router} from 'express';
import {salesValidationSchema} from '../middlewares/ValidationSchemas/salesDataValidation'
import {salesController}  from '../controllers/sales.controller'
const salesRoutes= Router();

   salesRoutes.post('/',salesValidationSchema,salesController.createSale);
   salesRoutes.get('/', salesController.sales);
   salesRoutes.get('/daily', salesController.getDailySales);
export{ salesRoutes}




