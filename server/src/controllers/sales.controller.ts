import { Response, Request } from "express";
import {SalesRepository}  from '../database/Repositories/Sales.repository'
import { SaleInterface } from "../interfaces/SalesInterface";
import { Sale } from "../database/entities/sales.entity";
import { Product } from "../database/entities/Product.entity";
import { databaseConfig } from "../database/dbconfig";
import RequestHandlers from "../database/RequestHandlers";
import PaginationOptions from '../interfaces/paginationOptions';
import { ProductRepository } from "../database/Repositories/Product.respository";
import { PurchaseRepository } from "../database/Repositories/Purchases.repository";
import { Purchases } from "../database/entities/purchases.entity";
import { Like} from 'typeorm';
 const ProductRepo= databaseConfig.getRepository(Product);
 const SalesRepository1= databaseConfig.getRepository(Sale);
 const PurchaseRepo= databaseConfig.getRepository(Purchases);
  export class salesController{
    static async createSale(req: Request, res: Response) {
      const productsData = req.body;
      const { sell_date, customer_name, payment_mode } = req.body;
      try {
        for (const product of productsData.products) {
          const productId = product.id;
          const productName = product.name;
          // Loop through purchases
          for (const purchase of product.purchases) {
            const quantity = purchase.quantity;
            const price = purchase.price;
            const subTotal = purchase.subTotal;
            const p_id = purchase.purchaseId;
            const productExists = await ProductRepo.findOne({ where: { id: productId } });
            if (productExists) {
              if (quantity <= productExists.qty) {
                const purchaseExists = await PurchaseRepo.findOne({ where: { id: p_id } });
                if (purchaseExists) {
                  const purchaseBalance = purchaseExists.purchase_Qty - purchaseExists.soldQty;
                  if (purchaseExists.purchase_Qty === purchaseExists.soldQty || quantity > purchaseBalance) {
                    return RequestHandlers.handlRequestFailure(res, 404)({
                      error: `INSUFFICIENT QUANTITY FOR ${productName} to sale ${quantity} items`,
                    });
                  } else {
                    const salesSuccess = await SalesRepository.RegisterSale(
                      customer_name,
                      quantity,
                      price,
                      subTotal,
                      sell_date,
                      productId,
                      payment_mode
                    );
                    if (salesSuccess) {
                      const newProductQty = productExists.qty - quantity;
                      productExists.qty = newProductQty;
                      await ProductRepository.updateQTY(productId, newProductQty);
    
                      const purchaseQtySold = purchaseExists.soldQty + quantity;
                      await PurchaseRepository.updatePurchaseQty(p_id, purchaseQtySold);
                      return RequestHandlers.handleRequestSuccess(res, 200)({
                        data: 'Sale Record created successfully! Thank you',
                      });
                    } else {
                      return RequestHandlers.handlRequestFailure(res, 404)({
                        error: 'Failed to create sales records',
                      });
                    }
                  }
                } else {
                  return RequestHandlers.handlRequestFailure(res, 404)({
                    error: `${p_id} DOES NOT EXIST IN PURCHASES`,
                  });
                }
              } else {
                return RequestHandlers.handlRequestFailure(res, 404)({
                  error: `${productName} INSUFFICIENT QUANTITY TO SALE ${quantity} UNITS`,
                });
              }
            } else {
              return RequestHandlers.handlRequestFailure(res, 404)({
                error: `${productName} NOT FOUND`,
              });
            }
          }
        }
      } catch (error: any) {
        return RequestHandlers.handlRequestFailure(res, 500)({
          error: `${error}`,
        });
      }
    }
    
    
    static sales=async(req:Request, res:Response)=>{
      const {sortBy, orderBy, searchValue, searchColumn, take, skip} = req.query;
      const searchCol= searchColumn as string;
      try {
      let whereClause = {};
        if (searchColumn && searchValue ) {
          whereClause = {
            [searchCol]: Like(`%${searchValue}%`),
            flag: 0,
          };
      }
      const options:PaginationOptions={
        take:Number(take) || 10,
        skip:Number(skip) || 0,
          order:{
          [sortBy as string]:orderBy
          },
          relations:['products'],
          
      where:whereClause
      }
        const paginatedResult= await SalesRepository.FetchSales(options)
        res.status(200).json(paginatedResult);
      } catch (error) {
      res.status(500).send('Error retrieving products');
      }
    }

    static async groupSalesById(req:Request, res:Response){
      try {
        const threshold = 0; // Set your desired sales threshold
          const groupByResult= await SalesRepository.GroupSalesByDay(threshold);
          res.send(groupByResult);
      } catch (error) {
        
      }
    }
   

    static async getDailySales(req: Request, res: Response) {
      const { startDate, endDate } = req.query;
    
      const queryBuilder = SalesRepository1.createQueryBuilder('sale')
        .select("DATE_FORMAT(sale.sell_date, '%Y-%m-%d')", 'saleDay')
        .addSelect('product.name', 'productName')
        .addSelect('SUM(sale.quantity)', 'totalQuantity')
        .addSelect('SUM(sale.price * sale.quantity)', 'totalRevenue')
        .innerJoin('sale.products', 'product')
        .groupBy('saleDay, productName')
        .orderBy('saleDay', 'DESC');
    
      if (startDate) {
        queryBuilder.andWhere('sale.sell_date >= :startDate', { startDate });
      }
    
      if (endDate) {
        queryBuilder.andWhere('sale.sell_date <= :endDate', { endDate });
      }
    
      const sales = await queryBuilder.getRawMany();
      const totalRevenue = sales.reduce((totalinit, sale) => totalinit + parseFloat(sale.totalRevenue || 0), 0);
      RequestHandlers.handleRequestSuccess(res, 200)({
        data: sales,
        totalDailyRevenue: totalRevenue.toFixed(2),
      });
    }
    
    
    
    
    
    
  }