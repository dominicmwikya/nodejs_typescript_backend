import {Repository, ObjectLiteral} from 'typeorm'
export  class InsertDataClass<T extends ObjectLiteral>{
   private repository:Repository<T>;
   
  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  public async insertData(data: T): Promise<any> {
    const result = await this.repository.save(data);
    console.log(`Inserted data:`, data);
    return result;
  }
}