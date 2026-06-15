import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastService.show('Session expired. Please log in again.', 'error', 4000);

        authService.logout();
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url },
        });
      }

      if (error.status === 403) {
        toastService.show(
          '[Error Interceptor]: 403 Forbidden. You do not have permission.',
          'warning',
          4000,
        );
      }

      if (error.status === 500) {
        toastService.show(
          '[Error Interceptor]: 500 Internal Server Error. Backend crashed.',
          'error',
          4000,
        );
      }

      return throwError(() => error);
    }),
  );
};
