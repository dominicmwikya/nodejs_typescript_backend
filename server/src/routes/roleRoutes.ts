import { Router } from 'express'
import { RoleController } from '../controllers/role.controller';

const roleRoutes= Router();

  roleRoutes.get('/', RoleController.getRoles);
 
export  {roleRoutes};