import{ Router } from 'express';
import { PurchasesController } from '../controllers/purchases.controller';
import { authGuard } from '../middlewares/Guards/authGuard';
import { authPermission } from '../middlewares/userPermissions';
const purchaseRoutes= Router();

purchaseRoutes.post('/post', PurchasesController.addPurchases);
purchaseRoutes.get(
    '/get',authGuard.verifyUserToken,
    authPermission(['user']),
    PurchasesController.getProductPurchases
    );

export{ purchaseRoutes}




