import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  error: string | null = null; // Error message handling
  isLoading: boolean = false; // Loading state

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    // Reset error state and start loading
    this.error = null;
    this.isLoading = true;

    // Basic validation check
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.error = 'All fields are required';
      this.isLoading = false;
      return;
    }

    // Call the registration method from AuthService
    this.authService
      .register({
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
      })
      .subscribe(
        (response) => {
          // On success, navigate to home or login
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        (error) => {
          // On error, show the error message
          this.isLoading = false;
          this.error =
            error.error.message || 'Registration failed. Please try again.';
        }
      );
  }
}
