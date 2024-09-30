import { Component, OnInit } from '@angular/core';
import { Product } from '../../types/Product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

interface AddItemToCartForUser {
  id: string;
  quantity: number;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  loading = true;
  isUserLoggedIn = false; // Track whether the user is logged in

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe((product) => {
        this.product = product;
        this.loading = false;
      });
    }

    // Subscribe to email to check if the user is logged in
    this.authService.getUserEmail().subscribe((email) => {
      this.isUserLoggedIn = !!email; // Set to true if email exists
    });
  }

  addItemToCartForUser({ id, quantity }: AddItemToCartForUser): void {
    if (!this.isUserLoggedIn) {
      this.router.navigate(['/login']); // Redirect to login if not logged in
    } else {
      // Add item to cart if the user is logged in
      this.cartService.addToCart({ id, quantity });
    }
  }
}
