import { Product } from '../entities/Product.entity';
import { User } from '../entities/User.entity';
import { databaseConfig } from '../dbconfig';
import ProductInterface from '../../interfaces/product';
import { Pagination } from '../../helpers/pagination'
import PaginationOptions from '../../interfaces/paginationOptions'
import PaginationData from '../../interfaces/PaginationData';
const product = new Product();
export class ProductRepository {
  private static ProductRepo = databaseConfig.getRepository(Product);
  private static UserRepo = databaseConfig.getRepository(User);
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

      await this.ProductRepo.save(product);
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
      }
    );
    return products;
  }

  static Paginate = async (options: PaginationOptions): Promise<PaginationData<Product>> => {
    const result = await Pagination(this.ProductRepo, options);
    return result;
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

  static updateProductInfo = async ({ name, min_qty, category }: ProductInterface, productId: number): Promise<null | object> => {
    const productExists = await this.ProductRepo.findOne({ where: { id: productId } });
    if (!productExists) {
      return null;
    }
    const result = await this.ProductRepo.update({ id: productId }, { name, min_qty, category });
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
      const deleteProductResult = await this.ProductRepo.delete(id);

      return deleteProductResult.affected !== 0;
    } catch (error: any) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }
}

