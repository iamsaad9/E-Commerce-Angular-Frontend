import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const credentialReq = req.clone({
    withCredentials: true,
  });

  return next(credentialReq);
};
