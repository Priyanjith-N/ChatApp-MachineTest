import { CanActivateFn, Router } from '@angular/router';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';

// services
import { AuthService } from '../services/auth.service';

// interfaces
import { IIsUserAuthenticatedSucessfullAPIResponse } from '../../shared/models/IAuthAPIResponses';

export const authPageAcessGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const isUserAuthenticatedAPIResponse$: Observable<IIsUserAuthenticatedSucessfullAPIResponse> = authService.isUserAuthenticated();

  return isUserAuthenticatedAPIResponse$.pipe(
    switchMap(() => {
      router.navigate(["/"]); // dont allow user to navigate login / register route.

      return of(false); 
    }),
    catchError(() => {
      return of(true); // allow user to acess the route
    })
  );
};
