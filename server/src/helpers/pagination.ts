import{Repository, FindManyOptions, ObjectLiteral} from 'typeorm';
import PaginationOptions from '../interfaces/paginationOptions';
import PaginationData  from '../interfaces/PaginationData'
export async function Pagination<T extends ObjectLiteral>(
    repository: Repository<T>,
    options: PaginationOptions,
  ): Promise<PaginationData<T>> {
    const { take, skip, order = {}, where = {} } = options || {};
    const queryOptions: FindManyOptions<T> = { take, skip, order, where };
    const [result, total] = await repository.findAndCount(queryOptions);
    const take1 = take ?? 1;
    const skip1 = skip ?? 0;
    const totalPages = Math.ceil(total / take1);
    const currentPage = Math.floor(skip1 / take1) + 1;
    const nextPage = skip1 + take1 < total ? currentPage + 1 : null;
    const prevPage = skip1 - take1 >= 0 ? currentPage - 1 : null;
  
    const paginationData: PaginationData<T> = {
      total,
      limit: take1,
      page: currentPage,
      totalPages,
      nextPage,
      prevPage,
      data: result,
    };
    return paginationData;
  }
  
