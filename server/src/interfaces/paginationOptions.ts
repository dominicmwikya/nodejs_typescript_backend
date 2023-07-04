export interface Relation {
  name: string;
  select?: string[];
}

export default interface PaginationOptions {
  take?: number;
  skip?: number;
  order?: object;
  where?: object;
  relations?: string[];
  orderBy?:string;
}