import { Product } from '../database/entities/Product.entity'
interface SaleInterface{
    customer_name:string;
    subTotal:number;
    sell_date:Date;
    id:number;
    quantity:number;
    price:number;
    payment_mode:string;
    products:Product[]
}

export { SaleInterface };
