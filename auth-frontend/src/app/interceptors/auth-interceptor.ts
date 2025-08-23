import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const authToken = authService.getToken();
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set( 'Authorization', `Bearer ${authToken}`),
      },
    );
    return next(authReq);
  }
  return next(req);
};
 