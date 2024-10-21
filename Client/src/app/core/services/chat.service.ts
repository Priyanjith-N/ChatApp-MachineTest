import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment'; // acessing environment variables

// interfaces
import { ICreateNewChatSuccessfullAPIResponse, ICreateNewGroupSuccessfullAPIResponse, IGetAllChatsSuccessfullAPIResponse, IGetMessagessOfChatSuccessfullAPIResponse, ISendMessageSuccessfullAPIResponse } from '../../shared/models/IChatAPIResponses';

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

  getMessagesOfChat(chatId: string): Observable<IGetMessagessOfChatSuccessfullAPIResponse> {
    const api: string = `${this.backendDomain}${UserAPIEndPoint.GET_MESSAGES_OF_CHAT}${chatId}`;

    const getMessagesOfChatAPIResponse$: Observable<IGetMessagessOfChatSuccessfullAPIResponse> = this.httpClient.get<IGetMessagessOfChatSuccessfullAPIResponse>(api);

    return getMessagesOfChatAPIResponse$;
  }

  sendMessage(content: string, type: "text" | "image" | "video" | "document", chatId: string): Observable<ISendMessageSuccessfullAPIResponse> {
   const api: string = `${this.backendDomain}${UserAPIEndPoint.SEND_MESSAGE}${chatId}`;
   
   const sendMessageAPIResponse$: Observable<ISendMessageSuccessfullAPIResponse> = this.httpClient.post<ISendMessageSuccessfullAPIResponse>(api, { content, type });

   return sendMessageAPIResponse$;
  }

  createNewGroupChat(groupName: string, groupMembers: string[]): Observable<ICreateNewGroupSuccessfullAPIResponse> {
    const api: string = `${this.backendDomain}${UserAPIEndPoint.CREATE_NEW_GROUP}`;

    const createNewGroupAPIResponse$: Observable<ICreateNewGroupSuccessfullAPIResponse> = this.httpClient.post<ICreateNewGroupSuccessfullAPIResponse>(api, { groupName, groupMembers });

    return createNewGroupAPIResponse$;
  }
}