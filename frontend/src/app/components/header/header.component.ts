import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service'; // Import CartService
import { ProductService } from '../../services/product.service'; // Import ProductService
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cartItemCount = 0; // Variable to hold the count of items in the cart
  isMobileMenuOpen = false;
  userEmail: string | null = null;
  searchQuery: string = ''; // Variable to hold the search query

  constructor(
    public router: Router,
    private authService: AuthService,
    private cartService: CartService, // Inject CartService
    private productService: ProductService, // Inject ProductService
    private cdr: ChangeDetectorRef // Can be removed if not required
  ) {}

  ngOnInit(): void {
    // Subscribe to user email from the AuthService
    this.authService.getUserEmail().subscribe((email) => {
      this.userEmail = email;
    });

    // Subscribe to cart length from the CartService
    this.cartService.getCartLength().subscribe((length) => {
      this.cartItemCount = length; // Update cart item count
    });
  }

  handleMobileMenuOpen() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    // userEmail will be set to null automatically since we're using the AuthService's observable
  }

  // Method to handle the search action
  onSearch() {
    this.productService.searchProductsByTitle(this.searchQuery); // Call the search method
    this.router.navigate(['/products']); // Optional: Navigate to the products page after search
  }
}
