import {Request, Response, NextFunction} from 'express'
import Jwt from 'jsonwebtoken'
import RequestUtils from "../../database/RequestHandlers"
export class authGuard{
    static  verifyUserToken(req:Request, res:Response, next:NextFunction){
      try {
        const my_secret_key:any=process.env.SECRET_KEY_API_KEY;
        const { headers: { authorization } } = req
        if(!authorization) throw new Error("No authentication was provided")
        const token: string | undefined = authorization?.split(" ")[1]
        if (!token) throw new Error("Invalid authentication headers")
        if (token){
            Jwt.verify(token, my_secret_key,
                (error: any, user:any) => {
                    if(error) throw new Error(error.message)
                    // @ts-ignore
                    req['user'] = user
                })
        }
        return next()
    } catch (error: any){
        RequestUtils.handlRequestFailure(res, 401)({
            message: error.message
        })
    }
    }
}