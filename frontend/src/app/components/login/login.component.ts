import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string | null = null; // To handle errors
  isLoading: boolean = false; // For loading state

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    // Reset error state and set loading to true
    this.error = null;
    this.isLoading = true;

    // Call the login method in AuthService
    this.authService
      .login({
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (response) => {
          // On success, handle response and navigate
          this.isLoading = false;
          this.router.navigate(['/']); // Navigate to home or another page after login
        },
        (error) => {
          // Handle error, display message to the user
          this.isLoading = false;
          this.error = error.error.message || 'Login failed. Please try again.'; // Show a user-friendly error message
        }
      );
  }
}
