
import {databaseConfig} from '../dbconfig';
import { Purchases } from '../entities/purchases.entity';
import { User } from '../entities/User.entity';
import { Product } from '../entities/Product.entity';
import { Supplier } from '../entities/Supplier.entity';
import PaginationOptions from '../../interfaces/paginationOptions'
import PaginationData from '../../interfaces/PaginationData';
import { Pagination } from '../../helpers/pagination'
export class PurchaseRepository{
 static PurchaseRepo= databaseConfig.getRepository(Purchases);
 static ProductRepo= databaseConfig.getRepository(Product)
 static async addNewPurchase(product: Product, supplier: Supplier, user: User, price: number, quantity: number): Promise<Purchases> {
      const newPurchase = new Purchases();
      newPurchase.product = product;
      newPurchase.supplier = supplier;
      newPurchase.user = user;
      newPurchase.price = price;
      newPurchase.quantity = quantity;
      newPurchase.total = Number.parseInt(price.toString()) * Number.parseInt(quantity.toString());
      // Begin a database transaction    
      try {
        // Save the new purchase record
        const savedPurchase = await this.PurchaseRepo.save(newPurchase);
    
        // Update the qty property of the product
        product.qty += Number.parseInt(quantity.toString());
        await this.ProductRepo.save(product);

        return savedPurchase;
      } catch (error) {
        throw error;
      }
    }
    

static async getAllPurchases():Promise<{}>{
      const results= await this.PurchaseRepo.find({
      relations:['user','product', 'supplier'],
      select:{ id:true, quantity:true, price:true,
                        user:{lastName:true, email:true, id:true },
                        product:{ id:true, name:true, qty:true  },
                        supplier:{ name:true, id:true }
            }
      });
      return results;
   }
   
static getPurchases = async (options: PaginationOptions): Promise<PaginationData<Purchases>> => {
      const result = await Pagination(this.PurchaseRepo, options);
      return result; 
   }
}