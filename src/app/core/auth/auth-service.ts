import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  LoginCommand,
  LoginResponse,
  RegisterCommand,
  RegisterResponse,
  User,
} from '../../features/auth/models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5288/api/auth';

  #currentUser = signal<User | null>(null);
  currentUser = this.#currentUser.asReadonly();
  isAuthenticated = computed(() => this.#currentUser() !== null);

  constructor() {
    const token = localStorage.getItem('access_token');
    if (token) {
      // const userData = this.parseJwt(token);
      // if(userData){
      //   this.#currentUser.set({
      //     fullName: userData.fullName,
      //     email: userData.email,
      //     role: userData.role,
      //   });
      // }
    }
  }

  register(command: RegisterCommand): Observable<ApiResponse<RegisterResponse>> {
    return this.http.post<ApiResponse<RegisterResponse>>(`${this.apiUrl}/register`, command);
  }

  login(command: LoginCommand): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, command).pipe(
      tap((response) => {
        if (response.success && response.data) {
          localStorage.setItem('access_token', response.data.accessToken);
          localStorage.setItem('refresh_token', response.data.refreshToken);

          this.#currentUser.set({
            id: response.data.id,
            fullName: response.data.fullName,
            email: response.data.email,
            role: response.data.role,
          });
        }
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.#currentUser.set(null);
  }
}
