import{databaseConfig} from '../dbconfig';
import { Supplier } from '../entities/Supplier.entity';
import supplierInterface from '../../interfaces/supplier'
// const supplierObj= new Supplier();
export class SupplierRepository{
    private static SupplierRepo= databaseConfig.getRepository(Supplier);
    
    static async createSupplier({
        name,
        email,
        phone,
        address,
      }: supplierInterface): Promise<null | object> {
        const supplierExists = await this.SupplierRepo.findOneBy({ name });
    
        try {
          if (supplierExists) {
            throw new Error(`Supplier with name ${name} already exists`);
          }
    
          const supplierObj = new Supplier();
          supplierObj.name = name;
          supplierObj.phone = phone;
          supplierObj.address = address;
          supplierObj.email = email;
    
          await this.SupplierRepo.save(supplierObj);
    
          return {
            message: `Supplier name ${name} added successfully`,
            success: true,
          };
        } catch (error: any) {
          throw new Error(`Failed to create supplier: ${error.message}`);
        }
      }

    static async getSuppliers(): Promise<Supplier[] | null>{
        try {
             const result= await this.SupplierRepo.find();
             return result;
        } catch (error:any) {
            return error
        }
    }
}