import { Response, Request } from "express";
import {SalesRepository}  from '../database/Repositories/Sales.repository'
import { SaleInterface } from "../interfaces/SalesInterface";
import { Sale } from "../database/entities/sales.entity";
import { Product } from "../database/entities/Product.entity";
import { databaseConfig } from "../database/dbconfig";
import RequestHandlers from "../database/RequestHandlers";
import PaginationOptions from '../interfaces/paginationOptions';
import { ProductRepository } from "../database/Repositories/Product.respository";
import { Like} from 'typeorm';
 const ProductRepo= databaseConfig.getRepository(Product);
 const SalesRepository1= databaseConfig.getRepository(Sale);
  export class salesController{
    static async createSale(req: Request, res: Response) {
      const productsData = req.body.products;
      const { sell_date, customer_name, payment_mode } = req.body;
      try {
        for (const product of productsData) {
          const { id, quantity, price, subTotal } = product; 
          const productExists = await ProductRepo.findOne({ where: { id: id} });
          if(productExists){
             if(quantity<=productExists.qty){
              const salesSuccess = await SalesRepository.RegisterSale(customer_name, quantity,price,subTotal,sell_date,id,payment_mode);
              if(salesSuccess){
                  const newProductQty= productExists.qty-quantity;
                  productExists.qty= newProductQty;
                  await ProductRepository.updateQTY(id, productExists.qty);
                 if(product===productsData[productsData.length-1]){
                  RequestHandlers.handleRequestSuccess(res, 200)({
                    message: "Sale Record Created successfully",
                  });
        
                 }
              }else{
                if (product === productsData[productsData.length - 1]) {
                  RequestHandlers.handlRequestFailure(res, 404)({
                    error: "Failed to create sales Records",
                  });
                }
              }
             }else{
              RequestHandlers.handlRequestFailure(res, 400)({
                error: "Insufficient product quantity for "+productExists.name,
              });
              return;
             }
          }else{
              RequestHandlers.handlRequestFailure(res, 404)({
                error:"Product Not Found"
              })
            }   
        }
      } catch (error:any) {
        RequestHandlers.handlRequestFailure(res, 500)({
          error:""+error
        })
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