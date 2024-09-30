import { Component, OnInit } from '@angular/core';
import { Product } from '../../types/Product';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service'; // Import NotificationService
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Fixed typo from styleUrl to styleUrls
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private toastr: ToastrService // Inject NotificationService
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }
  showError(message: string) {
    this.toastr.error(message, 'Error', { closeButton: true });
  }

  fetchProducts() {
    this.productService.getProducts().subscribe(
      (res) => {
        this.products = res;
      },
      (error) => {
        this.showError('Error fetching products'); // Error notification
      }
    );
  }
}
