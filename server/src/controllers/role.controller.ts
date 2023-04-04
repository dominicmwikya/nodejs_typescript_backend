import {RoleRepository} from "../database/Repositories/roleRepository";
import {Response, Request} from 'express';
import RequestUtils from "../database/RequestHandlers";
export class RoleController{
    static async getRoles(req:Request, res:Response){
      try {
           const roles= await RoleRepository.fetchRoles();
           RequestUtils.handleRequestSuccess(res, 200)({
            roles
           })
      } catch (error:any) {
        RequestUtils.handlRequestFailure(res,401)({
            error:error.message
        })
      }
    }
    
}