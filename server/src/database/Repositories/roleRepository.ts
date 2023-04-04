import {Role} from '../entities/Role.entity'
import { databaseConfig } from '../dbconfig';

export  class RoleRepository{
    private static roleRepository=databaseConfig.getRepository(Role);
  
    static async fetchRoles(){
        return await this.roleRepository.find();
    }

    static async findByIds(roleId:any){
          const role=await this.roleRepository.findOne(roleId);
          return role;
    }
}