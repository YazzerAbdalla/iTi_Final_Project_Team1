import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BACKEND_URL } from '../../env';

import { Cart } from '../types/Cart';
import { Product } from '../types/Product';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service'; // Import AuthService

export interface CartItem {
  productId: string;
  unitPrice: number;
  productName: string;
  productImage: string;
  quantity: number;
  _id: string;
}
interface AddToCart {
  id: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.cartItems);
  private cartLengthSubject = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService // Inject AuthService
  ) {
    // Subscribe to user's authentication status
    this.authService.getUserEmail().subscribe((email) => {
      if (email) {
        this.fetchCart(); // Fetch cart if user is logged in
      } else {
        this.cartItems = []; // Clear cart if user is logged out
        this.cartItemsSubject.next(this.cartItems); // Update cart items
        this.cartLengthSubject.next(this.cartItems.length); // Update cart length
      }
    });
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  getCartLength(): Observable<number> {
    return this.cartLengthSubject.asObservable();
  }

  fetchCart() {
    this.http
      .get<{ data: { items: CartItem[] } }>(`${BACKEND_URL}/cart`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('authorization')}`,
        },
      })
      .pipe(
        catchError((error) => {
          this.notificationService.showError('Error fetching cart.');
          return throwError(() => error);
        })
      )
      .subscribe((response) => {
        if (response && response.data) {
          this.cartItems = response.data.items;
          this.cartItemsSubject.next(this.cartItems);
          this.cartLengthSubject.next(this.cartItems.length);
        }
      });
  }

  addToCart({ id, quantity }: AddToCart): void {
    const payload = {
      itemId: id,
      quantity: quantity,
    };

    this.http
      .post<Cart>(`${BACKEND_URL}/cart/item`, payload, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('authorization')}`,
        },
      })
      .subscribe(
        (response: any) => {
          const existingItem = this.cartItems.find((i) => i.productId === id);
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            this.cartItems = response.data.items;
          }

          this.cartItemsSubject.next(this.cartItems);
          this.cartLengthSubject.next(this.cartItems.length);
        },
        (error) => {
          this.notificationService.showError('Error adding item to cart.');
          return throwError(() => error);
        }
      );
  }

  removeFromCart(productId: string): void {
    this.http
      .delete(`${BACKEND_URL}/cart/item/${productId}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('authorization')}`,
        },
      })
      .subscribe(
        (response: any) => {
          this.cartItems = this.cartItems.filter(
            (item) => item.productId !== productId
          );
          this.cartItemsSubject.next(this.cartItems);
          this.cartLengthSubject.next(this.cartItems.length);
        },
        (error) => {
          this.notificationService.showError('Error removing item from cart.');
          return throwError(() => error);
        }
      );
  }

  clearCart(): void {
    this.http
      .delete(`${BACKEND_URL}/cart`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('authorization')}`,
        },
      })
      .subscribe(
        (response: any) => {
          this.cartItems = [];
          this.cartItemsSubject.next(this.cartItems);
          this.cartLengthSubject.next(this.cartItems.length);
        },
        (error) => {
          this.notificationService.showError('Error clearing cart.');
          return throwError(() => error);
        }
      );
  }

  // New method to update an item in the cart
  updateCartItem(item: CartItem): void {
    const payload = {
      itemId: item.productId,
      quantity: item.quantity,
    };

    this.http
      .put<Cart>(`${BACKEND_URL}/cart/item`, payload, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('authorization')}`,
        },
      })
      .subscribe(
        (response: any) => {
          // Update the cart item locally
          const index = this.cartItems.findIndex(
            (i) => i.productId === item.productId
          );
          if (index > -1) {
            this.cartItems[index].quantity = item.quantity; // Update the quantity
          }

          this.cartItemsSubject.next(this.cartItems);
          this.cartLengthSubject.next(this.cartItems.length);
          this.notificationService.showSuccess('Item updated successfuly.');
        },
        (error) => {
          this.notificationService.showError('Error updating item in cart.');
          return throwError(() => error);
        }
      );
  }
}
