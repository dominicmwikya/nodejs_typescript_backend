import { Response, Request } from "express";
import UserRespository from "../database/Repositories/UserRepository";
import RequestUtils from "../database/RequestHandlers";

export class UserController {
  static async registerNewUser(req: Request, res: Response) {
    const id = req.body.roleId;
    try {
      const user = await UserRespository.registerUser(req.body, id);
      RequestUtils.handleRequestSuccess(res, 200)({
        user: {
          message: "User Created successfully! Please Check your email for activation",
          activation: user?.activation
        }
      });
    } catch (err: any) {
      RequestUtils.handlRequestFailure(res, 400)({
        error: err.message,
      });
    }
  }

  static async verifyUserCode(req: Request, res: Response) {
    const { uniquestring } = req.params;
    try {
      const result = await UserRespository.verifyCode(uniquestring);
      res.redirect('http://localhost:3000/login');
    } catch (error: any) {
      RequestUtils.handlRequestFailure(res, 404)({
        error: error
      });
    }
  }
  

  static async loginUser(req: Request, res: Response) {
    try {
      const result = await UserRespository.loginUser(req.body);
      RequestUtils.handleRequestSuccess(res, 200)({
        result,
      });
    } catch (error: any) {
      RequestUtils.handlRequestFailure(res, 400)({
        error: error.message
      });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const user = await UserRespository.getUsers();
      RequestUtils.handleRequestSuccess(res, 200)({
        user: user
      });
    } catch (error: any) {
      RequestUtils.handlRequestFailure(res, 400)({
        error: error.message,
      });
    }
  }

  async users() {
    const users = await UserRespository.fetchUsers();
    return users;
  }
}
