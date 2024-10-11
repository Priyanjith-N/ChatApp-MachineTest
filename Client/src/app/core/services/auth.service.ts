import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment'; // acessing environment variables

// enums
import { AuthAPIEndPoint } from '../enums/authAPIEndPoint';

// interfaces
import { ILoginSucessfullAPIResponse, IRegisterSucessfullAPIResponse } from '../../shared/models/IAuthAPIResponses';
import { IUserLoginCredentials, IUserRegisterationCredentials } from '../../shared/models/IAuthCredentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient: HttpClient = inject(HttpClient);

  private backendDomain: string = environment.BACKEND_DOMAIN;

  handelLogin(loginCredentials: IUserLoginCredentials): Observable<ILoginSucessfullAPIResponse> {
    const api: string = `${this.backendDomain}${AuthAPIEndPoint.LOGIN_API}`;

    const loginAPIResponse: Observable<ILoginSucessfullAPIResponse> = this.httpClient.post<ILoginSucessfullAPIResponse>(api, loginCredentials);

    return loginAPIResponse;
  }

  handelRegisteration(registerCredentials: IUserRegisterationCredentials): Observable<IRegisterSucessfullAPIResponse> {
    const api: string = `${this.backendDomain}${AuthAPIEndPoint.REGISTER_API}`;

    const registerAPIResponse: Observable<IRegisterSucessfullAPIResponse> = this.httpClient.post<IRegisterSucessfullAPIResponse>(api, registerCredentials);

    return registerAPIResponse;
  }
}
