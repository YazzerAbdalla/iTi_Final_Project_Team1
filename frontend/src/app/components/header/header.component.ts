import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service'; // Import CartService

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cartItemCount = 0; // Variable to hold the count of items in the cart
  isMobileMenuOpen = false;
  userEmail: string | null = null;

  constructor(
    public router: Router,
    private authService: AuthService,
    private cartService: CartService, // Inject CartService
    private cdr: ChangeDetectorRef // Can be removed if not required
  ) {}

  ngOnInit(): void {
    // Subscribe to user email from the AuthService
    this.authService.getUserEmail().subscribe((email) => {
      this.userEmail = email;
      // Only trigger change detection manually if necessary
      // this.cdr.detectChanges();  // Optional: use if needed for manual change detection
    });

    // Subscribe to cart length from the CartService
    this.cartService.getCartLength().subscribe((length) => {
      this.cartItemCount = length; // Update cart item count
      // this.cdr.detectChanges(); // Optional: use if needed for manual change detection
    });
  }

  handleMobileMenuOpen() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    // userEmail will be set to null automatically since we're using the AuthService's observable
  }
}
