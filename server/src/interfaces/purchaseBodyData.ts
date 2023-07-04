import { Purchases } from "../database/entities/purchases.entity";
 interface purchaseBodyData extends Purchases{
    productId:number;
    userId:number;
    quantity:number;
    price:number;
    supplierId:number;
    sprice:number;
}

export {purchaseBodyData}