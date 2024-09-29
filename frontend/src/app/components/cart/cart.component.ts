import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'], // Changed to styleUrls for consistency
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  userEmail: string | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchCartItems();
    this.fetchUserEmail();
  }

  private fetchCartItems() {
    this.cartService.getCartItems().subscribe((cartItems) => {
      this.cartItems = cartItems; // Directly use the cart items from the observable
      this.calculateTotal(); // Calculate total after fetching items
    });
  }

  private fetchUserEmail() {
    this.authService.getUserEmail().subscribe((email) => {
      this.userEmail = email;
    });
  }

  private calculateTotal() {
    this.totalAmount = this.cartItems.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId); // Use productId to remove item
    this.fetchCartItems(); // Refresh cart items after removal
  }

  clearCart() {
    this.cartService.clearCart(); // Clear all items in the cart
    this.fetchCartItems(); // Refresh cart items after clearing
  }
}
