import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isInitialized()) {
    if (authService.isAuthenticated()) {
      return router.createUrlTree(['/categories']);
    }
    return true;
  }

  return authService.checkSession().pipe(
    take(1),
    map(() => {
      if (authService.isAuthenticated()) {
        return router.createUrlTree(['/categories']);
      }
      return true;
    }),
  );
};
