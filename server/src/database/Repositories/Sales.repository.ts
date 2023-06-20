
import {Sale}  from '../entities/sales.entity';
import {databaseConfig} from '../dbconfig';
import { Product } from '../entities/Product.entity';
import PaginationData from '../../interfaces/PaginationData';
import { Pagination } from '../../helpers/pagination';
import PaginationOptions from '../../interfaces/paginationOptions';

export class SalesRepository{
 private static SalesRepo= databaseConfig.getRepository(Sale); 
 private static ProductRepository= databaseConfig.getRepository(Product);
 static async RegisterSale(customer_name:string, quantity:number, price:number,subTotal:number, sell_date:Date,id:Product,payment_mode:string ):Promise<Sale> {
    try {
      const newSale = new Sale();
      newSale.customer_name=customer_name;
      newSale.quantity=quantity;
     
      newSale.price=price;
      newSale.subTotal=subTotal;
      newSale.sell_date=sell_date
      newSale.products=id;
      newSale.payment_mode=payment_mode;

     const response = await this.SalesRepo.save(newSale);
      return response;
    } catch (error) {
      throw new Error(error + " Error occurred");
    }
  }
  
  static FetchSales = async (options: PaginationOptions): Promise<PaginationData<Sale>> => {
    const result = await Pagination(this.SalesRepo, options);
    return result; 
 }

 static GroupSalesByDay=async(threshold: number)=>{
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const products= await this.ProductRepository.find();
  const salesPerDayPromises = products.map(async (product) => {
    const salesPerDay = await this.SalesRepo
      .createQueryBuilder('sale')
      .select('DATE(sale.sell_date)', 'day')
      .addSelect('COUNT(*)', 'count')
      .where('sale.productsId = :productId', { productId: product.id })
      .andWhere('sale.sell_Date >= :today', { today })
      .groupBy('day')
      .having('COUNT(*) > :threshold', { threshold })
      .getRawMany();

    return {
      product,
      salesPerDay,
    };
  });

  const productsSalesPerDay = await Promise.all(salesPerDayPromises);
  return productsSalesPerDay
}
}