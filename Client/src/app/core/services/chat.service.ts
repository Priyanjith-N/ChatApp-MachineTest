import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment'; // acessing environment variables

// interfaces
import { ICreateNewChatSuccessfullAPIResponse, IGetAllChatsSuccessfullAPIResponse } from '../../shared/models/IChatAPIResponses';

// enums
import { UserAPIEndPoint } from '../enums/userAPIEndPoint';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private httpClient: HttpClient = inject(HttpClient);

  private backendDomain: string = environment.BACKEND_DOMAIN;

  createNewChat(reciverId: string): Observable<ICreateNewChatSuccessfullAPIResponse> {
    const api: string = `${this.backendDomain}${UserAPIEndPoint.CREATE_NEW_CHAT}`;

    const createNewChatAPIResponse$: Observable<ICreateNewChatSuccessfullAPIResponse> = this.httpClient.post<ICreateNewChatSuccessfullAPIResponse>(api, { reciverId });

    return createNewChatAPIResponse$;
  }

  getAllChats(): Observable<IGetAllChatsSuccessfullAPIResponse> {
    const api: string = `${this.backendDomain}${UserAPIEndPoint.GET_ALL_CHATS}`;

    const getALLChatsAPIResponse$: Observable<IGetAllChatsSuccessfullAPIResponse> = this.httpClient.get<IGetAllChatsSuccessfullAPIResponse>(api);

    return getALLChatsAPIResponse$;
  }
}
