import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Product, ProductResponse } from '../types/Product';
import { BACKEND_URL } from '../../env';

import { NotificationService } from './notification.service';

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

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
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
          this.notificationService.showError('Error fetching products.'); // Show error notification
          return throwError(() => error);
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
            this.notificationService.showError('Error fetching product.'); // Show error notification
            return throwError(() => error);
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

  // Search for products by title
  searchProductsByTitle(title: string): void {
    if (title.trim() === '') {
      // If the search title is empty, reset to the original product list
      this.productsSubject.next(this.products);
      return;
    }

    const filteredProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(title.toLowerCase())
    );

    this.productsSubject.next(filteredProducts); // Emit the filtered products
  }
}
