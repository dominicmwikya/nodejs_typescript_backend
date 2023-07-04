
import {databaseConfig} from '../dbconfig';
import { Purchases } from '../entities/purchases.entity';
import { User } from '../entities/User.entity';
import { Product } from '../entities/Product.entity';
import { Supplier } from '../entities/Supplier.entity';
import { BatchNumbers } from '../entities/BatchNo.entity';
import PaginationOptions from '../../interfaces/paginationOptions'
import PaginationData from '../../interfaces/PaginationData';
import { Pagination } from '../../helpers/pagination';
import { format } from "date-fns";

export class PurchaseRepository{
 static PurchaseRepo= databaseConfig.getRepository(Purchases);
 static ProductRepo= databaseConfig.getRepository(Product);
 static BatchRepo= databaseConfig.getRepository(BatchNumbers);

 static async addNewPurchase(product: Product, supplier: Supplier, user: User, price: number, quantity: number,sprice:number): Promise<Purchases> {
     const batchnumber= await this.generateBatchNumber();
      const newPurchase = new Purchases();
      newPurchase.product = product;
      newPurchase.supplier = supplier;
      newPurchase.user = user;
      newPurchase.purchase_Price = price;
      newPurchase.purchase_Qty = quantity;
      newPurchase.batchcode= `${batchnumber}`;
      newPurchase.purchase_Total = Number.parseInt(price.toString()) * Number.parseInt(quantity.toString());
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
   static  async generateBatchNumber():Promise<string>{
        const newBatch= await this.BatchRepo.save({});
        const currentDate= new Date();
        const formattedDate= format(currentDate, "yyyyMMdd");

        const batchId= newBatch.id;
        const bactNumber= `BATCH${formattedDate}${batchId}`;
        return bactNumber;
    }

static async getAllPurchases():Promise<{}>{
      const results= await this.PurchaseRepo.find({
      relations:['user','product', 'supplier'],
     
      select:{ id:true, purchase_Qty:true, purchase_Price:true,
                        user:{lastName:true, email:true, id:true },
                        product:{ id:true, name:true, qty:true  },
                        supplier:{ name:true, id:true }
            },
            order:{createdAt:'DESC'}
      });
      return results;
   }
   
static getPurchases = async (options: PaginationOptions): Promise<PaginationData<Purchases>> => {
      const result = await Pagination(this.PurchaseRepo, options);
      return result; 
   }
   static async  updatePurchaseQty(pId:number, qty:number){
    const result= await this.PurchaseRepo.update({id:pId}, {soldQty:qty});
    return result;
}
}