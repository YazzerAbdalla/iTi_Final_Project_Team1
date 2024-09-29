import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_URL } from '../env';

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
  constructor(private http: HttpClient) {}
  email: string = '';
  login({ email, password }: LoginProps): Observable<any> {
    return this.http.post(`${BACKEND_URL}/login`, { email, password });
  }
  register({
    email,
    firstName,
    lastName,
    password,
  }: RegisterProps): Observable<any> {
    return this.http.post(`${BACKEND_URL}/register`, {
      email,
      firstName,
      lastName,
      password,
    });
  }
  logout() {
    localStorage.removeItem('authorization');
  }
}
