import { Component, OnInit } from '@angular/core';
import { Product } from '../../types/Product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';

interface AddItemToCartForUser {
  id: string;
  quantity: number;
}
@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  loading = true;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe((product) => {
        this.product = product;
        this.loading = false;
      });
    }
  }

  addItemToCartForUser({ id, quantity }: AddItemToCartForUser) {
    this.cartService.addToCart({ id, quantity });
  }
}
