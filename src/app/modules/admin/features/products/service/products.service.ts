import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  map,
  Observable,
  pipe,
  Subscription,
  throwError,
} from 'rxjs';
import { CreateProduct } from '../../../../../shared/models/create-products.model';
import { Product } from '../../../../../shared/models/products';
import { CrudProductsService } from './products.interface.service';
import { baseURL } from '../../../../../shared/constans';

@Injectable({
  providedIn: 'root',
})
export class ProductsService implements CrudProductsService<Product> {
  apiURL:string;
  token: string | null;
  private subscription = new Subscription();
  constructor(private Http: HttpClient) {
    this.apiURL = baseURL.concat("products");
    this.token = localStorage.getItem('accessToken');
  }

  //hay que validar despues la nulabilidad despues del token globalmente en esta clase
  async createProduct(product: CreateProduct): Promise<any> {
    return this.Http.post<any>(`${this.apiURL}/create`, product, {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        Authorization: 'Bearer '.concat(this.token!),
      },
    }).pipe((x) => {
      this.subscription.add(
        x.subscribe({
          next: (data) => {
    
          },
        })
      );

      return x;
    }, catchError(this.handleError));
  }
  private handleError(error: any): Observable<never> {
    console.error('Error en API:', error);
    return throwError(() => new Error('Error al comunicarse con la API'));
  }

  getAllProducts(): Observable<any[]> {
    return this.Http.get<any[]>(`${this.apiURL}/get-all`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        Authorization: 'Bearer '.concat(this.token!),
      },
    }).pipe(
      map((x: any) => {
        return x.data.page;
      }),
      catchError(this.handleError)
    );
  }

  async getProductById(id: string): Promise<Product> {
    return fetch(`${this.apiURL}/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener el producto');
        }
        return response.json();
      })
      .then((data) => data as Product)
      .catch((error) => {
        console.error('Error en la solicitud:', error);
        throw error;
      });
  }

  updateProduct(
    productId: string,
    updateProduct: { presentationId: string; newStock: number }
  ): Observable<any> {
    return this.Http.patch<any[]>(
      `${this.apiURL}/update-stock/${productId}`,
      updateProduct,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: 'Bearer '.concat(this.token!),
        },
      }
    ).pipe((x) => {
      return x;
    }, catchError(this.handleError));
  }

  deleteProduct(id: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      Accept: '*/*',
      Authorization: 'Bearer '.concat(this.token!),
    };
    const body = {};
    return this.Http.patch<any>(`${this.apiURL}/delete/${id}`, body, {
      headers,
    }).pipe((x) => {
      return x;
      catchError(this.handleError);
    });
  }
}
