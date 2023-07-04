import { Response } from 'express';

export default class RequestHandlers {
  static handleRequestSuccess<T>(res: Response, statusCode = 200) {
    return (body: T) => {
      res.status(statusCode).send({
        status: statusCode,
        success: true,
        ...body,
      });
    };
  }

  static handlRequestFailure(res: Response, statusCode = 400) {
    return (body: any) => {
      res.status(statusCode).send({
        status: statusCode,
        success: false,
        ...body,
      });
    };
  }

  static handleTypes(obj:string | string[]){
    type stringArray=Array<string>  //generic type of a array of type string;
     
  }

  static testGeneric<S,T>(s:S, t:T):S{
    return s;
  }
}

