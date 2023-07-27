import { Router } from 'express';
import { ProductValidator } from '../middlewares/ValidationSchemas/ProductSchema';
import { ProductController } from '../controllers/product.controller';
import { authPermission } from '../middlewares/userPermissions';
import { authGuard } from '../middlewares/Guards/authGuard';
import ProductService  from '../services/ProductService'
const productRoutes = Router();

productRoutes.post(
  '/:userId',
  authGuard.verifyUserToken,
  ProductValidator,
  ProductController.CreateProduct
);
productRoutes.get(
        '/testing',
         ProductController.testHelper
);
productRoutes.get(
        '/search',
        authGuard.verifyUserToken,
        ProductController.findProductByName
);
productRoutes.get(
        '/test',
        authGuard.verifyUserToken,
        ProductController.testProductPaginate
);
productRoutes.get(
        '/:id',
        authGuard.verifyUserToken,
        ProductController.getEditProduct
);
productRoutes.put(
        '/:id',authGuard.verifyUserToken,
        ProductController.updateProduct
);
productRoutes.delete(
        '/:id', authGuard.verifyUserToken,
        ProductController.deletProduct
);
productRoutes.get(
        '/', authGuard.verifyUserToken,
        authPermission(['user']),
        ProductController.getProducts
);
export { productRoutes };
