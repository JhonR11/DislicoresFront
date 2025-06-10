import { Observable } from 'rxjs';

export interface CrudProductsService<T> {
  getAllProducts(): Observable<T[]>;
  getProductById(id: string): Promise<T>;
  getAllCategorys(): Observable<any>;
  createProduct(product: any): Promise<any>;
  updateProduct(id: string, item: any): Observable<T>;
  deleteProduct(id: string): Observable<T>;
}
