import { Component } from '@angular/core';
import { Product } from '../../types/Product';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  products: Product[] = [];

  constructor(private productService: ProductService) {
    this.fetchProducts();
  }
  fetchProducts() {
    this.productService.getProducts().subscribe((res) => {
      this.products = res;
    });
  }
}
