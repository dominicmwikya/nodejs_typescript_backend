export default interface PaginationData<T> {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
    data: T[];
  }