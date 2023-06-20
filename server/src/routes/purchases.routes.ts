import{Router} from 'express';
import { PurchasesController } from '../controllers/purchases.controller';
const purchaseRoutes= Router();

purchaseRoutes.post('/post', PurchasesController.addPurchases);
purchaseRoutes.get('/get',PurchasesController.getProductPurchases);

export{ purchaseRoutes}




