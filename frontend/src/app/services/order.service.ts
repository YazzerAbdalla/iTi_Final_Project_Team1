import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service'; // Import AuthService
import { NotificationService } from './notification.service'; // Import NotificationService
import { BACKEND_URL } from '../../env'; // Assuming this is where the backend URL is stored
import { Order } from '../types/Order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orderSubject: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService, // Inject AuthService to check user email
    private notificationService: NotificationService // To show error messages if necessary
  ) {
    this.fetchOrder();
  }

  // Fetch orders only if the email exists
  fetchOrder() {
    // Subscribe to the user's email from the AuthService
    this.authService.getUserEmail().subscribe((email) => {
      if (email) {
        // If email exists, proceed to fetch the orders
        this.http
          .get<{ data: Order[] }>(`${BACKEND_URL}/order`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('authorization')}`,
            },
          })
          .pipe(
            catchError((error) => {
              this.notificationService.showError('Error fetching order.');
              return throwError(() => error);
            })
          )
          .subscribe(
            (response) => {
              if (response && response.data) {
                this.orderSubject.next(response.data); // Update the order subject
              }
            },
            (error) => {
              this.notificationService.showError('Failed to fetch order.');
            }
          );
      } else {
        // If email doesn't exist, handle it (e.g., show notification)
        this.notificationService.showError(
          'No user email found. Please log in.'
        );
      }
    });
  }

  // Get observable for order
  getOrder() {
    return this.orderSubject.asObservable();
  }
}
