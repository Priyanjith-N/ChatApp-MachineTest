import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment'; // acessing environment variables

// enums
import { UserAPIEndPoint } from '../enums/userAPIEndPoint';
import {  } from '../../shared/models/IUserAPIResponses';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private httpClient: HttpClient = inject(HttpClient);

  private backendDomain: string = environment.BACKEND_DOMAIN;
}
