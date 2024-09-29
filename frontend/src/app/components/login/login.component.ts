import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) {}

  onSubmit() {
    // You can add logic for login here, like calling an authentication service.
    console.log('Login attempted with:', this.email, this.password);

    // Redirect to home or another page upon successful login
    // For now, this is just a placeholder
    // Example: this.authService.login(this.email, this.password);
  }
}
