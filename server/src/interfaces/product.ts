import {User} from '../database/entities/User.entity'
export default interface ProductInterface {
    id: number;
    name: string;
    category: string;
    min_qty: number;
    qty: number;
    users:User
  }
  


  export default interface IPostProduct {
    name: string;
    description: string;
    min_qty: number;
    category:string,
  }
  