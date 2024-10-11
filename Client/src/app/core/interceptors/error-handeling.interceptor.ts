import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { IValidationError } from '../../shared/models/IAPIErrorResponses';

export const errorHandelingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: any) => {
      if(!err.error) return throwError(err);

      const errObj: any = err.error;

      if(errObj.errorField) {
        return throwError(errObj as IValidationError);
      }

      return throwError(err.error);
    })
  );
};
