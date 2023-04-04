import {Product} from '../entities/Product.entity';
import { User } from '../entities/User.entity';
import { databaseConfig } from '../dbconfig';
import ProductInterface from '../../interfaces/product'
export class ProductRepository{
    private static ProductRepo= databaseConfig.getRepository(Product);
    private static UserRepo= databaseConfig.getRepository(User);

    static async CreateProduct(product: ProductInterface, userId: number): Promise<Product | { error: string }> {
        const productExists = await this.ProductRepo.findOneBy({ name: product.name });
    
        if (productExists) {
            throw new Error(`Product with name ${product.name} already exist`);
        }
    
        const user: User | null = await this.UserRepo.findOne({
            where: { id: userId },
            select: ['id'],
        });
    
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
    
        product.users = user;
        const savedProduct = await this.ProductRepo.save(product);
        return savedProduct;
    }

    static FetchProducts = async (): Promise<ProductInterface[] | null> => {
        const products = await this.ProductRepo.find(
            {
          select: {
            id: true,
            name: true,
            min_qty: true,
            qty: true,
            category: true,
            // Select the name field from the associated user object
            users: {
                id: true,
                email:true,
                firstName:true
            }
          },
          relations: {
            users: true
          },
          order: {
            id: 'ASC'
          }
        }
        );
      
        return products;
      }
}