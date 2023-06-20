import {Router} from 'express';
import { SupplerController } from '../controllers/supplier.controller';
const SupplerRoutes= Router();
  
   SupplerRoutes.get('/get', SupplerController.fetchSuppliers);
   SupplerRoutes.post('/create', SupplerController.createSupplier);

export {SupplerRoutes}