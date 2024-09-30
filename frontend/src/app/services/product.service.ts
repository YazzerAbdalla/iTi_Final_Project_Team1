import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Product, ProductResponse } from '../types/Product';
import { BACKEND_URL } from '../env';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  product!: Product;
  productSubject: BehaviorSubject<Product> = new BehaviorSubject<Product>(
    this.product
  );
  products: Product[] = [];
  productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(
    this.products
  );

  constructor(private http: HttpClient) {
    this.fetchProducts();
  }

  // Fetch all products and update the BehaviorSubject
  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  fetchProducts() {
    this.http
      .get<ProductResponse>(`${BACKEND_URL}/product`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching products:', error);
          return throwError(() => new Error('Error fetching products'));
        })
      )
      .subscribe((response) => {
        if (response && response.data) {
          this.products = response.data;
          this.productsSubject.next(this.products);
        }
      });
  }

  // Fetch a product by ID and update the productSubject
  getProductById(productId: string): Observable<Product> {
    return new Observable<Product>((observer) => {
      this.http
        .get<{ data: Product }>(`${BACKEND_URL}/product/${productId}`)
        .pipe(
          catchError((error) => {
            console.error(
              `Error fetching product with id ${productId}:`,
              error
            );
            return throwError(() => new Error('Error fetching product by ID'));
          })
        )
        .subscribe((product) => {
          this.product = product.data;
          this.productSubject.next(this.product);
          observer.next(this.product); // Emit the product for the subscriber
          observer.complete();
        });
    });
  }

  // Subscribe to product subject for single product
  getProduct(): Observable<Product> {
    return this.productSubject.asObservable();
  }
}
