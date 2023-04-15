import { Response, Request } from "express";
import {ProductRepository} from '../database/Repositories/Product.respository';
import RequestHandlers from "../database/RequestHandlers";
import IPostProduct from '../interfaces/product';
import {Pagination} from '../helpers/pagination'
import { Like} from 'typeorm'
import PaginationOptions from '../interfaces/paginationOptions'

// import {Paginate} from 
export class ProductController{
    static async CreateProduct(req:Request, res:Response){
        const values= req.body as IPostProduct;   //type casting.Enforce type safety via interfacce
        const {userId}= req.params;
        const id=parseInt(userId);
        try {
            const data=await ProductRepository.CreateProduct(values,id);
            RequestHandlers.handleRequestSuccess(res, 200)({
            data
           })
        } catch (error:any) {
          RequestHandlers.handlRequestFailure(res, 400)({
                error: error.message,
           });
        }
    }
    
    static async getProducts(req:Request, res: Response) {
        try {
          const products = await ProductRepository.FetchProducts();
          RequestHandlers.handleRequestSuccess(res, 200)({
             products
          });
        } catch (error: any) {
          RequestHandlers.handlRequestFailure(res, 400)({
            error: error.message,
          });
         }
      }
  
    static async testProductPaginate(req:Request, res:Response){
       const sortBy=req.query.sortBy;
       const orderBy=req.query.orderBy;
       const limit=req.query.take;
       const start = req.query.skip;
       const searchValue=req.query.searchValue;
       const searchColumn= req.query.searchColumn as string;
        try {
          let whereClause = {};

          if (searchColumn && searchValue ) {
            whereClause = { [searchColumn]: Like(`%${searchValue}%`) };
          }
          const options:PaginationOptions={
            take:Number(limit) || 10,
            skip:Number(start) || 0,
            order:{
              [sortBy as string]:orderBy
            },
            where:whereClause
          }
    
          const paginatedResult= await ProductRepository.Paginate(options)
          res.status(200).json(paginatedResult);
        
        } catch (error) {
          res.status(500).send('Error retrieving products');
        }
      }

    static async getEditProduct(req: Request, res: Response) {
      const id= req.params.id
      const productId=parseInt(id) 
      try {
        const product = await ProductRepository.FetchEditProduct(productId);
        const producteditResult = product ? [product] : [];
        RequestHandlers.handleRequestSuccess(res, 200)({
          producteditResult
        });
      } catch (error: any) {
        RequestHandlers.handlRequestFailure(res, 400)({
          error: error.message,
        });
        }
    }

      static async updateProduct(req:Request, res:Response){
        const values= req.body as IPostProduct;   //type casting.Enforce type safety via interfacce
        const {id}= req.params;
        const productId=parseInt(id);
        try {
            const data=await ProductRepository.updateProductInfo(values,productId);
            RequestHandlers.handleRequestSuccess(res, 200)({
            data
           })
        } catch (error:any) {
          RequestHandlers.handlRequestFailure(res, 400)({
                error: error.message,
           })
        }
    }

    static async deletProduct(req:Request, res:Response){
      const entityId = req.params.id; 
      const id=parseInt(entityId)
      const deleteSuccessful= await ProductRepository.clearProductById(id);
      
        if(deleteSuccessful){
          RequestHandlers.handleRequestSuccess(res,200)({
            message:`product with id ${id} deleted successfully`
          })
        }else{
          RequestHandlers.handlRequestFailure(res, 404)({
              error:`Failed to delete product with id ${id}. Contact Admin`
          })
      } 
  }
}