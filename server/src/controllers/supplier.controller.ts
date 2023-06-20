import {Request, Response } from 'express';
import {SupplierRepository} from '../database/Repositories/Supplier.respository';
import RequestHandlers from '../database/RequestHandlers';
export class SupplerController{
    static async createSupplier(req:Request, res:Response){
       try {
        const body= req.body;
        const response= await SupplierRepository.createSupplier(body);
        RequestHandlers.handleRequestSuccess(res, 201)({
          response
        })
       } catch (error:any) {
          RequestHandlers.handlRequestFailure(res, 401)({
            error:error.message
          })
       }
      }
    
    static async fetchSuppliers(req: Request, res:Response){
           try {
               const suppliers= SupplierRepository.getSuppliers();
               console.log(suppliers);
               RequestHandlers.handleRequestSuccess(res, 200)({
                 suppliers
               })
           } catch (error:any) {
              RequestHandlers.handlRequestFailure(res, 400)({
                error:error.message("Failed to fetch suppliers")
              })
           }
      }
     
}