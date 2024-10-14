import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

// interfaces
import { IValidationError } from '../../shared/models/IAPIErrorResponses';

// enums
import { ErrorType } from '../enums/errorType';
import { AuthAPIEndPoint } from '../enums/authAPIEndPoint';

export const errorHandelingInterceptor: HttpInterceptorFn = (req, next) => {
  const avoidRoute: string = `/${req.url.split('/').slice(-2).join("/")}`;

  if(avoidRoute === AuthAPIEndPoint.IS_USER_AUTHENTICATED) {
    return next(req);
  }
  
  const router: Router = inject(Router);

  return next(req).pipe(
    catchError((err: any) => {
      if(!err.error) return throwError(() => err);

      const errObj: any = err.error;

      if(errObj.errorField) {
        return throwError(() => errObj as IValidationError);
      }else if(errObj.type === ErrorType.TOKEN) {
        // router.navigate(["/auth/login"]); // user is not authenticated
      }

      return throwError(() => err.error);
    })
  );
};
