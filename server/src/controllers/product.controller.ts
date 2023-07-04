import { Response, Request } from "express";
import {ProductRepository} from '../database/Repositories/Product.respository';
import RequestHandlers from "../database/RequestHandlers";
import IPostProduct from '../interfaces/product';
import { Like} from 'typeorm';
import PaginationOptions from '../interfaces/paginationOptions';
export class ProductController{
    static async CreateProduct(req:Request, res:Response){
        const values= req.body as IPostProduct;   //type casting.Enforce type safety via interfacce
        const {userId}= req.params;
        const id=parseInt(userId);
        try {
            const data=await ProductRepository.CreateProduct(values,id);
            RequestHandlers.handleRequestSuccess(res, 201)({
            data
           })
        } catch (error:any) {
          RequestHandlers.handlRequestFailure(res, 400)({
                error: error.message,
           });
        }
    }
  static async testHelper(id:number){
       const r= await ProductRepository.getEditProduct(id);
       console.log(r)
       return r;
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
      const{sortBy, orderBy,take, skip, searchValue, searchColumn}= req.query;
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

  static async findProductByName(req: Request, res: Response){
    const searchTerm = req.query.searchTerm as string || '';
    try {
      const data = await ProductRepository.getProductByName(searchTerm);
        RequestHandlers.handleRequestSuccess(res, 200)({
          data
        })
    } catch (error) {
       RequestHandlers.handlRequestFailure(res, 500)({
        error:error
       })
    }
  };
}








