import { Product } from '../entities/Product.entity';
import { User } from '../entities/User.entity';
import { databaseConfig } from '../dbconfig';
import ProductInterface from '../../interfaces/product';
import { Pagination } from '../../helpers/pagination'
import PaginationOptions from '../../interfaces/paginationOptions'
import PaginationData from '../../interfaces/PaginationData';
import { Purchases } from '../entities/purchases.entity';
import {InsertHelper} from '../Repositories/InsertHelper'
import { ILike } from 'typeorm';
const product = new Product();
const proRepo= databaseConfig.getRepository(Product);
   const insertDataObj= new InsertHelper<Product>(proRepo);
export class ProductRepository {

  private readonly ProductRepo1;

  constructor() {
    this.ProductRepo1 = databaseConfig.getRepository(Product);
  }
  private static ProductRepo = databaseConfig.getRepository(Product);
  private static UserRepo = databaseConfig.getRepository(User);
  private static PurchasesRepo= databaseConfig.getRepository(Purchases);
  /**
* Creates a new product.
* @param {Object} data - The data for the new product.
* @param {string} data.name - The name of the product.
* @param {number} data.min_qty - The minimum quantity of the product.
* @param {number} data.qty - The current quantity of the product.
* @param {string} data.category - The category of the product.
* @param {number} userId - The ID of the user creating the product.
* @returns {Promise<ApiResponse>} A response indicating whether the product was created successfully.
* @throws {Error} If the product already exists or the user is not found.
*/


  static async CreateProduct({ name, min_qty, category }: ProductInterface, userId: number): Promise<Product | null | Object> {
    const productExists = await this.ProductRepo.findOneBy({ name });
    try {
      if (productExists) {
        throw new Error(`Product with name ${name} already exist`);
      }
      const user: User | null = await this.UserRepo.findOne({
        where: { id: userId },
        select: ['id'],
      });

      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }

      product.name = name;
      product.min_qty = min_qty;
      product.category = category;
      product.users = user;
      // const insertDataObj= new InsertHelper<Product>(this.ProductRepo);
      await insertDataObj.insertDataMethod(product);
      // await this.ProductRepo.save(product);
      return {
        message: `Product ${name} added successfully`,
        code: 1,
      };
    } catch (error: any) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }
  /**
* Fetches all products with associated user details.
* @returns {Promise<Product[]>} The list of products.
*/
  static FetchProducts = async (): Promise<Product[]> => {
    const products = await this.ProductRepo.find(
      {
        select: {
          id: true,
          name: true,
          min_qty: true,
          qty: true,
          category: true,

          users: {
            id: true,
            email: true,
            firstName: true
          }
        },
        relations: {
          users: true
        },
        where:{flag:0}
      }
    );
    return products;
  }

  static Paginate = async (options: PaginationOptions): Promise<PaginationData<Product>> => {
    const result = await Pagination(this.ProductRepo, options);
    return result;
  }
  
  static getEditProduct=async(id:number)=>{
         const result= new InsertHelper<Product>(this.ProductRepo);
         const product= await result.FetchEditProduct();
         return product;
  }
  
  static FetchEditProduct = async (id: number): Promise<Product | null> => {
    const product = await this.ProductRepo.findOne({ where: { id: id } });
    return product || null;
  }
 
  /** 
  * Update product
  * @param {Object} data update data object of type ProductInterface.
  * @param {string} data.name name of the product.
  * @param {number} data.min_qty  product min qty
  * @param {string}  data.category  product cat
  * @param {number} productId of the product to update
  * @returns {Promise<apiResponse>} indicating update success/ fail. 
  * 
*/

  static updateProductInfo = async ({ name, qty,min_qty, category }: ProductInterface, productId: number): Promise<null | object> => {
    const productExists = await this.ProductRepo.findOne({ where: { id: productId } });
    if (!productExists) {
      return null;
    }
    const result = await this.ProductRepo.update({ id: productId }, { name, min_qty, category,qty });
    if (result.affected === 0) {
      return { error: `ERROR! Error occured while Updating product id ${productId}` };
    }
    return { message: `Product ${productId} updated successfully!.` };
  }

  /**
  * Deletes a product by ID.
  * @param {number} id - The ID of the product to delete.
  * @returns {Promise<boolean>} A boolean indicating whether the product was deleted successfully.
  */
 
  static async clearProductById(id: number): Promise<boolean> {
    try {
      const result = await this.ProductRepo.update({ id: id }, { flag: 1 });
      return result.affected !== 0;
    } catch (error: any) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }
  

  static async getProductByName(name: string): Promise<Product[]> {
    const productsWithPurchases: Product[] = [];
    try {
      const purchases = await this.PurchasesRepo.find({
        where: {
          batchcode: ILike(`${name}%`),
        },
      });
  
      for (const purchase of purchases) {
        try {
          const product = await this.ProductRepo.findOne({
            relations: ['purchases'],
            where: { purchases: { id: purchase.id } },
          });
  
          if (product) {
            productsWithPurchases.push(product);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
    return productsWithPurchases;
  }
  
  
  
  static async updateQTY(idd:number, qtyy:number){
     const response=  await this.ProductRepo.update({id:idd }, {qty:qtyy});
     return response;
  }
   async testme(){
      console.log("succes")
   }
}

