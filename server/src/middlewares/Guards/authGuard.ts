import {Request, Response, NextFunction} from 'express'
import Jwt from 'jsonwebtoken'
import RequestUtils from '../../database/RequestHandlers';
export class authGuard{
    static  verifyUserToken(req:Request, res:Response, next:NextFunction){
       try {

          const { headers: { authorization } } = req;
         
          if(!authorization) throw new Error("No authentication was provided")
          // const token: string | undefined = authorization?.split(" ")[1]
          const token =  authGuard.extractTokenFromHeader(req);
            if(!token){
              throw new Error("Invalid aunthentication headers");
            }
            const my_secret_key:any=process.env.SECRET_KEY_API_KEY;
            Jwt.verify(token,my_secret_key, (error:any, payload:any)=>{
              if(error) {
                throw new Error(error+" Invalid token! try again")
              } else{
                  // @ts-ignore
                    req.user = payload;
                    return next();
              }
            })
       } catch (error:any) {
          RequestUtils.handlRequestFailure(res, 401)({
            message:error.message,
            authStatus:false
        })
       }
    }

    private static extractTokenFromHeader(request:Request):string | undefined{
        const [type, token] = request.headers.authorization?.split(' ')?? [''];
          return type == 'Bearer'? token: undefined;
    }
  
}

