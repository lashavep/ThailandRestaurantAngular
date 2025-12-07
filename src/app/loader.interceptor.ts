import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { tap, finalize } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const authService = inject(AuthService);

  const isProductsRequest = req.url.includes('https://localhost:7183/api/Products/GetAllProduct');

  if (isProductsRequest) {
    loaderService.show();
  }

  return next(req).pipe(
    tap({
      next: () => {
        if (isProductsRequest) loaderService.hide(150);
      },
      error: (error: HttpErrorResponse) => {
        if (isProductsRequest) loaderService.setError();
        if (error.status === 401) {
          authService.logout();
        }
      }
    }),
    finalize(() => {
      if (isProductsRequest) loaderService.hide(150);
    })
  );
};
