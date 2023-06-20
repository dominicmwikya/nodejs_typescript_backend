import { PurchaseRepository } from "../database/Repositories/Purchases.repository";
import { Supplier } from "../database/entities/Supplier.entity";
import { Product } from "../database/entities/Product.entity";
import { User } from "../database/entities/User.entity";
import { databaseConfig } from "../database/dbconfig";
import {purchaseBodyData}  from "../interfaces/purchaseBodyData";
import PaginationOptions from '../interfaces/paginationOptions';
import { Response, Request } from "express";
import { Purchases } from "../database/entities/purchases.entity";
import { Like} from 'typeorm';
import RequestHandlers from "../database/RequestHandlers";
const  ProductRepo= databaseConfig.getRepository(Product);
const SupplierRepo= databaseConfig.getRepository(Supplier);
const  UserRepo= databaseConfig.getRepository(User);
export class PurchasesController {  
  static async addPurchases(req: any, res: any) {
    const purchasesData = req.body;
    const savedPurchases:Purchases[]= [];
    try {
        for (const purchase of purchasesData as purchaseBodyData[] ) {
            const product = await ProductRepo.findOneOrFail({ where: { id: purchase.productId } });
            const supplier = await SupplierRepo.findOneOrFail({ where: { id: purchase.supplierId } });
            const user = await UserRepo.findOneOrFail({ where: { id: purchase.userId } });
            const Result:Purchases = await PurchaseRepository.addNewPurchase(product, supplier, user, purchase.price, purchase.quantity);
            savedPurchases.push(Result);
        }
        RequestHandlers.handleRequestSuccess(res,200)({
          message:'Purchase Record(s) has been added successfully! Thank you!'
        })
      } catch (error:any) {
        RequestHandlers.handlRequestFailure(res, 404)({
          error:error
        })
    }
  }

  static async getProductPurchases(req:Request, res:Response){
      const {sortBy, orderBy, searchValue, searchColumn, take, skip} = req.query;
      const searchCol= searchColumn as string;
        try {
          let whereClause = {};
          if (searchColumn && searchValue ) {
            whereClause = { [searchCol]: Like(`%${searchValue}%`) };
          }
          const options:PaginationOptions={
            take:Number(take) || 10,
            skip:Number(skip) || 0,
            order:{
              [sortBy as string]:orderBy
            },
            relations: [
            'user',
            'product',
            'supplier'
          ],
            where:whereClause
          }
          const paginatedResult= await PurchaseRepository.getPurchases(options)
          res.status(200).json(paginatedResult);
        } catch (error) {
          res.status(500).send('Error retrieving products');
        }
    }  
}
