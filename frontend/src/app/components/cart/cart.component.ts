import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
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
    this.totalAmount = Math.floor(this.totalAmount);
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId); // Use productId to remove item
    this.fetchCartItems(); // Refresh cart items after removal
  }

  clearCart() {
    this.cartService.clearCart(); // Clear all items in the cart
    this.fetchCartItems(); // Refresh cart items after clearing
  }

  // Update the quantity of an item
  updateQuantity(item: CartItem, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(item.productId); // Remove the item if the quantity is zero or less
    } else {
      item.quantity = quantity; // Update the quantity
      this.cartService.updateCartItem(item); // Call service to update the item in the cart
      this.calculateTotal(); // Recalculate total amount
    }
  }
}
