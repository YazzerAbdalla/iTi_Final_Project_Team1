import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { errorContext } from 'rxjs/internal/util/errorContext';

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
  error!: string;
  data!: string;
  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    // You can add logic for login here, like calling an authentication service.
    // Redirect to home or another page upon successful login
    // For now, this is just a placeholder
    // Example: this.authService.login(this.email, this.password);
    this.authService
      .login({
        email: this.email,
        password: this.password,
      })
      .subscribe(
        (data) => {
          this.data = data.data;
          localStorage.setItem('authorization', `Bearer ${this.data}`);
          this.authService.email = this.email;
          this.router.navigate(['/']);
        },
        (error) => {
          this.error = error.error.data;
        }
      );
  }
}
