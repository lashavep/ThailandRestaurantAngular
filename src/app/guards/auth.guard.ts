import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const role = authService.getUserRole();

  const allowedRoles = route.data?.['roles'] as string[] || [];

  if (isLoggedIn && allowedRoles.includes(role)) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
