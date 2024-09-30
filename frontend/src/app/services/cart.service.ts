import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Import catchError for error handling
import { BACKEND_URL } from '../env';
import { Cart } from '../types/Cart';
import { Product } from '../types/Product';

export interface CartItem {
  productId: string; // Assuming this corresponds to your product's ID
  unitPrice: number;
  productName: string;
  productImage: string;
  quantity: number;
  _id: string; // MongoDB Object ID
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

  constructor(private http: HttpClient) {
    this.fetchCart(); // Fetch the cart on initialization
  }

  // Get observable for cart items
  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  // Get observable for cart length
  getCartLength(): Observable<number> {
    return this.cartLengthSubject.asObservable();
  }

  // Fetch cart items from the server
  fetchCart() {
    this.http
      .get<{ data: { items: CartItem[] } }>(`${BACKEND_URL}/cart`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('authorization')}`,
        },
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching cart:', error);
          return []; // Handle error as needed
        })
      )
      .subscribe((response) => {
        if (response && response.data) {
          this.cartItems = response.data.items;
          this.cartItemsSubject.next(this.cartItems); // Update the BehaviorSubject with cart items
          this.cartLengthSubject.next(this.cartItems.length); // Update the cart length
        }
      });
  }

  // Add an item to the cart
  addToCart({ id, quantity }: AddToCart): void {
    // Prepare the payload for the HTTP request
    const payload = {
      itemId: id,
      quantity: quantity,
    };

    // Make an HTTP POST request to add the item to the cart on the backend
    this.http
      .post<Cart>(`${BACKEND_URL}/cart/item`, payload, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('authorization')}`,
        },
      })
      .subscribe(
        (response: any) => {
          // Update cartItems based on the response
          const existingItem = this.cartItems.find((i) => i.productId === id);
          if (existingItem) {
            existingItem.quantity += quantity; // Increment quantity if item already exists
          } else {
            this.cartItems = response.data.items; // Add new item to cart
          }

          // Notify observers of the cart items and length
          this.cartItemsSubject.next(this.cartItems); // Update cart items
          this.cartLengthSubject.next(this.cartItems.length); // Update cart length
        },
        (error) => {
          console.error('Error adding item to cart', error); // Handle any errors
        }
      );
  }

  // Remove an item from the cart
  removeFromCart(productId: string): void {
    // Make an HTTP DELETE request to remove the item from the cart on the backend
    this.http
      .delete(`${BACKEND_URL}/cart/item/${productId}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('authorization')}`,
        },
      })
      .subscribe(
        (response: any) => {
          // Filter out the removed item from cartItems
          this.cartItems = this.cartItems.filter(
            (item) => item.productId !== productId
          );

          // Notify observers of the updated cart items and length
          this.cartItemsSubject.next(this.cartItems); // Update cart items
          this.cartLengthSubject.next(this.cartItems.length); // Update cart length
        },
        (error) => {
          console.error('Error removing item from cart', error); // Handle any errors
        }
      );
  }

  // Clear all items from the cart
  clearCart(): void {
    // Make an HTTP DELETE request to clear the cart on the backend
    this.http
      .delete(`${BACKEND_URL}/cart`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('authorization')}`,
        },
      })
      .subscribe(
        (response: any) => {
          // Clear the local cart items array
          this.cartItems = [];

          // Notify observers of the updated cart items and length
          this.cartItemsSubject.next(this.cartItems); // Update cart items
          this.cartLengthSubject.next(this.cartItems.length); // Update cart length
        },
        (error) => {
          console.error('Error clearing cart', error); // Handle any errors
        }
      );
  }
}
