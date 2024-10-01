import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { NotificationService } from './notification.service';
import { BACKEND_URL } from '../../env';

interface LoginProps {
  email: string;
  password: string;
}
interface RegisterProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // A BehaviorSubject to store and emit the current user's email
  private emailSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    // Initialize email from localStorage if available
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      this.emailSubject.next(savedEmail);
    }
  }

  // Expose the email as an Observable
  getUserEmail(): Observable<string | null> {
    return this.emailSubject.asObservable();
  }

  login({ email, password }: LoginProps): Observable<any> {
    return this.http.post(`${BACKEND_URL}/login`, { email, password }).pipe(
      tap((response: any) => {
        // Assuming the response contains a token and email
        if (response && response.data) {
          localStorage.setItem('authorization', response.data);
          this.emailSubject.next(email); // Update the BehaviorSubject with the new email
          localStorage.setItem('email', email); // Save email in localStorage
        }
      }),
      catchError((error) => {
        this.notificationService.showError('Login failed. Please try again.'); // Show error notification
        return throwError(() => error); // Rethrow the error
      })
    );
  }

  register({
    email,
    firstName,
    lastName,
    password,
  }: RegisterProps): Observable<any> {
    return this.http
      .post(`${BACKEND_URL}/register`, {
        email,
        firstName,
        lastName,
        password,
      })
      .pipe(
        tap((response: any) => {
          // Assuming the response contains a token and email
          if (response && response.data) {
            localStorage.setItem('authorization', response.data);
            this.emailSubject.next(email); // Update the BehaviorSubject with the new email
            localStorage.setItem('email', email); // Save email in localStorage
          }
        }),
        catchError((error) => {
          this.notificationService.showError(
            'Register failed. Please try again.'
          ); // Show error notification
          return throwError(() => error); // Rethrow the error
        })
      );
  }

  logout() {
    this.emailSubject.next(null); // Set email to null in BehaviorSubject
    localStorage.removeItem('authorization');
    localStorage.removeItem('email'); // Remove email from localStorage
  }
}
