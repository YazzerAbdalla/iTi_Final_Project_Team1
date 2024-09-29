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
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  error!: string;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    // You can add logic for registration here, like calling a registration service.
    // Redirect to login page upon successful registration
    // For now, this is just a placeholder
    // Example: this.authService.register(this.firstName, this.lastName, this.email, this.password);
    this.authService
      .register({
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
      })
      .subscribe(
        (data) => {
          localStorage.setItem('authorization', `Bearer ${data.data}`);
          this.authService.email = this.email;
          this.router.navigate(['/']);
        },
        (error) => {
          this.error = error.error.data;
        }
      );
  }
}
