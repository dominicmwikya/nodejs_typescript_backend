import { Repository, ObjectLiteral, FindOptionsWhere } from "typeorm";
import { Response, Request } from "express";
export class InsertHelper<T extends ObjectLiteral> {
    private genericRepository: Repository<T>;
    constructor(entityClass:Repository<T>){
       this.genericRepository=entityClass;
    }
 
    async insertDataMethod(data:T):Promise<any>{
       const result= await this.genericRepository.save(data);
       return result;
    }
 
    async fetchData():Promise<any>{
        const result= await this.genericRepository.find();
        return result;
    }

    public async create(data:T):Promise<T>{
      return await this.genericRepository.save(data);
    }

    FetchEditProduct = async(): Promise<void> => {
      
      
    }
   //  public async update(id: number, data: Partial<T>): Promise<T | undefined> {
   //    await this.genericRepository.update(id, data);
   //    const entity= await  this.genericRepository.findOne({where:{id:id}});
   //    return entity || undefined;
   //  }

    public async delete(id:number):Promise<void>{
      await this.genericRepository.delete(id);
    }
}