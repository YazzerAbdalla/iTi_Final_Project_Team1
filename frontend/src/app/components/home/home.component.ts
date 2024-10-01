import { Component, OnInit } from '@angular/core';
import { Product } from '../../types/Product';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  originalFilteredProducts: Product[] = []; // To store the original order of filtered products
  categories: string[] = [];
  selectedCategory: string = 'all';
  activeSort: 'price' | 'popularity' | null = null; // State variable to track active sort option

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
        this.filteredProducts = this.products;
        this.originalFilteredProducts = [...this.products]; // Store original order
        this.extractCategories();
      },
      (error) => {
        this.showError('Error fetching products'); // Error notification
      }
    );
  }

  // Extract unique categories from products
  extractCategories() {
    if (this.products.length > 0) {
      const categorySet = new Set(
        this.products.map((product) => product.category)
      );
      this.categories = Array.from(categorySet);
      console.log(this.categories); // This will show the categories in the console
    } else {
      console.log('No products available to extract categories.');
    }
  }

  // Filter products by category
  filterByCategory() {
    if (this.selectedCategory === 'all') {
      this.filteredProducts = this.products; // Show all products if 'all' is selected
    } else {
      this.filteredProducts = this.products.filter(
        (product) => product.category === this.selectedCategory
      );
    }

    // Reset the original filtered products after filtering
    this.originalFilteredProducts = [...this.filteredProducts];
  }

  // Sort by high price
  sortByHighPrice() {
    if (this.activeSort === 'price') {
      this.activeSort = null; // Clear sort if already active
      this.filteredProducts = [...this.originalFilteredProducts]; // Reset to original order
      return; // Early return if toggled off
    }

    this.activeSort = 'price'; // Set active sort option
    this.filteredProducts.sort((a, b) => b.price - a.price); // Sort by high price
  }

  // Sort by popularity (rating)
  sortByPopularity() {
    if (this.activeSort === 'popularity') {
      this.activeSort = null; // Clear sort if already active
      this.filteredProducts = [...this.originalFilteredProducts]; // Reset to original order
      return; // Early return if toggled off
    }

    this.activeSort = 'popularity'; // Set active sort option
    this.filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate); // Sort by popularity
  }
}
