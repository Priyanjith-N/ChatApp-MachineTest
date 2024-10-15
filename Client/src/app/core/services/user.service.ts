import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment'; // acessing environment variables

// enums
import { UserAPIEndPoint } from '../enums/userAPIEndPoint';
import { IGetAllUserProfileSuccessfullAPIResponse, IGetUserProfileSuccessfullAPIResponse, ILogoutSuccessfullAPIResponse } from '../../shared/models/IUserAPIResponses';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpClient: HttpClient = inject(HttpClient);

  private backendDomain: string = environment.BACKEND_DOMAIN;

  getUserProfile(): Observable<IGetUserProfileSuccessfullAPIResponse> {
    const api: string = `${this.backendDomain}${UserAPIEndPoint.GET_USER_PROFILE}`;

    const getUserProfileAPIResponse$: Observable<IGetUserProfileSuccessfullAPIResponse> = this.httpClient.get<IGetUserProfileSuccessfullAPIResponse>(api);

    return getUserProfileAPIResponse$;
  }

  handelLogout(): Observable<ILogoutSuccessfullAPIResponse> {
    const api: string = `${this.backendDomain}${UserAPIEndPoint.LOGOUT}`;

    const logoutAPIResponse$: Observable<ILogoutSuccessfullAPIResponse> = this.httpClient.post<ILogoutSuccessfullAPIResponse>(api, {});

    return logoutAPIResponse$;
  }

  getAllUsers(): Observable<IGetAllUserProfileSuccessfullAPIResponse> {
    const api: string = `${this.backendDomain}${UserAPIEndPoint.GET_ALL_USERS}`;

    const getAllUsersAPIResponse$: Observable<IGetAllUserProfileSuccessfullAPIResponse> = this.httpClient.get<IGetAllUserProfileSuccessfullAPIResponse>(api);

    return getAllUsersAPIResponse$;
  }
}