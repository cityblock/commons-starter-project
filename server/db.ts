export interface IPaginationOptions {
  pageNumber: number;
  pageSize: number;
}

export interface IPaginatedResults<T> {
  results: T[];
  total: number;
}
