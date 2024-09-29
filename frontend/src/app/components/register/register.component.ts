import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) {}

  onSubmit() {
    // You can add logic for registration here, like calling a registration service.
    console.log(
      'Registration attempted with:',
      this.firstName,
      this.lastName,
      this.email,
      this.password
    );

    // Redirect to login page upon successful registration
    // For now, this is just a placeholder
    // Example: this.authService.register(this.firstName, this.lastName, this.email, this.password);
  }
}
