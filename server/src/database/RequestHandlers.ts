import { Response, Request } from "express";

export default class RequestUtils{
  static handleRequestSuccess<T>(res: Response, statusCode: number = 200) {
        return (body: T) => {
            res.status(statusCode).send({
                status: statusCode,
                success: true,
                ...body
            })
        }
    }

    static handlRequestFailure(res:Response, statusCode:number=400){
        return (body:any)=>{
            res.status(statusCode).send({
                status:statusCode,
                success:false,
                ...body
            })
        }
    }
    
}