import { Response, Request } from "express";
import {ProductRepository} from '../database/Repositories/Product.respository';
import RequestUtils from "../database/RequestHandlers";
export class ProductController{
    static async CreateProduct(req:Request, res:Response){
        const values= req.body;
        const {userId}= req.params;
        const id=parseInt(userId)

        try {
            const result=await ProductRepository.CreateProduct(values, id);
            RequestUtils.handleRequestSuccess(res, 200)({
            result
           })
        } catch (error:any) {
            RequestUtils.handlRequestFailure(res, 404)({
                error: error.message,
           })
        }
    }
    
   
    static async getProducts(req: Request, res: Response) {
        try {
          const user = await ProductRepository.FetchProducts();
          RequestUtils.handleRequestSuccess(res, 200)({
            user: user
          });
        } catch (error: any) {
          RequestUtils.handlRequestFailure(res, 400)({
            error: error.message,
          });
        }
      }
  
}