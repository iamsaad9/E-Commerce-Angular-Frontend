import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, tap, throwError } from 'rxjs';
import {
  LoginCommand,
  LoginResponse,
  RegisterCommand,
  RegisterResponse,
  User,
} from '../models/auth.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5288/api/auth';

  // State Management (Signals)
  #currentUser = signal<User | null>(null);
  currentUser = this.#currentUser.asReadonly();
  isAuthenticated = computed(() => this.#currentUser() !== null);

  #isInitialized = signal<boolean>(false);
  isInitialized = this.#isInitialized.asReadonly();

  constructor() {}

  checkSession(): Observable<boolean> {
    if (this.#isInitialized()) {
      return of(true);
    }
    return this.http.get<ApiResponse<User | null>>(`${this.apiUrl}/me`).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.#currentUser.set(response.data);
        } else {
          console.log('/ME Returned 401 Error');
        }
      }),
      map(() => true),
      catchError(() => {
        console.warn('⚠️ Access token expired or invalid. Attempting silent session refresh...');

        return this.refreshSession().pipe(
          map((response) => {
            return response.success && response.data !== null;
          }),
          catchError(() => {
            console.error('🚨 Refresh token expired. User must log in again.');
            this.#currentUser.set(null);
            return of(false);
          }),
        );
      }),
      finalize(() => {
        this.#isInitialized.set(true);
      }),
    );
  }

  register(command: RegisterCommand): Observable<ApiResponse<RegisterResponse>> {
    return this.http.post<ApiResponse<RegisterResponse>>(`${this.apiUrl}/register`, command);
  }

  login(command: LoginCommand): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, command).pipe(
      tap((response) => {
        if (response.success && response.data) {
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

  logout(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.#currentUser.set(null);
        console.info('Successfully Logged out.');
      }),
      catchError((err) => {
        this.#currentUser.set(null);
        return throwError(() => err);
      }),
    );
  }

  refreshSession(): Observable<ApiResponse<User | null>> {
    return this.http.post<ApiResponse<User | null>>(`${this.apiUrl}/refresh-token`, {}).pipe(
      tap((response) => {
        if (response.success && response.data) {
          console.log('✅ Refresh Token found! Session refreshed.');
          this.#currentUser.set(response.data);
        } else {
          this.#currentUser.set(null);
        }
      }),
      catchError((err) => {
        this.#currentUser.set(null);
        return throwError(() => err);
      }),
    );
  }
}
