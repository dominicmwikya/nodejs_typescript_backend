import { Response, Request } from "express";
import UserRespository from "../database/Repositories/UserRepository";
import RequestHandlers from "../database/RequestHandlers";
import { Like} from 'typeorm'
import PaginationOptions from '../interfaces/paginationOptions'
export class UserController {
  static async registerNewUser(req: Request, res: Response) {
    const id = req.body.roleId;
    try {
      const user = await UserRespository.registerUser(req.body, id);
      RequestHandlers.handleRequestSuccess(res, 200)({
        user: {
          message: "User Created successfully! Please Check your email for activation",
          activation: user?.activation
        }
      });
    } catch (err: any) {
      RequestHandlers.handlRequestFailure(res, 404)({
        error: err.message,
      });
    }
  }

  static async testProductPaginate(req:Request, res:Response):Promise<any>{
    const { page, sortBy, orderBy, skip, take, searchValue, searchColumn } = req.query;
      try {
        const search = searchColumn && searchValue ? { [searchColumn as string]: Like(`%${searchValue}%`) } : undefined;
        const options: PaginationOptions & { search?: any } = {
          take: Number(take),
          skip: Number(skip),
          order: { [sortBy as string]: orderBy },
          search,
        };
        
        if (page) {
          options.skip = (Number(page) - 1) * (options.take ?? 2);
        }

        console.log(options);
        const paginatedResult = await UserRespository.Paginate(options);
        res.status(200).json(paginatedResult);
      } catch (error) {
        res.status(500).send('Error retrieving products');
      }

   }

  static async verifyUserCode(req: Request, res: Response) {
    const { uniquestring } = req.params;
    try {
      await UserRespository.verifyCode(uniquestring);
      res.redirect('http://localhost:3000/login');
    } catch (error: any) {
      RequestHandlers.handlRequestFailure(res, 404)({
        error: error
      });
    }
  }
  
  static async loginUser(req: Request, res: Response) {
    try {
      const result = await UserRespository.loginUser(req.body);
      RequestHandlers.handleRequestSuccess(res, 200)({
        result,
      });
    } catch (error: any) {
      RequestHandlers.handlRequestFailure(res, 400)({
        error: error.message
      });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const user = await UserRespository.getUsers();
      RequestHandlers.handleRequestSuccess(res, 200)({
        user: user
      });
    } catch (error: any) {
      RequestHandlers.handlRequestFailure(res, 400)({
        error: error.message,
      });
    }
  }

  async users() {
    const users = await UserRespository.fetchUsers();
    return users;
  }
}
