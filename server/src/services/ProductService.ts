import { Response, Request } from "express";
import { ProductRepository } from '../database/Repositories/Product.respository';
import RequestHandlers from "../database/RequestHandlers";
import IPostProduct from '../interfaces/product';
import { Like } from 'typeorm';
import PaginationOptions from '../interfaces/paginationOptions';

class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async tesMyconstructor(){
    await this.productRepository.testme();
  }
}

export default ProductService;
