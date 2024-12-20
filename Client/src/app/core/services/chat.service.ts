import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment'; // acessing environment variables

// interfaces
import { IAddNewMembersInGroupSuccessfullAPIResponse, ICreateNewChatSuccessfullAPIResponse, ICreateNewGroupSuccessfullAPIResponse, IGetAllChatsSuccessfullAPIResponse, IGetAllUsersNotPresentInCurrentGroupSuccessfullAPIResponse, IGetMessagessOfChatSuccessfullAPIResponse, ILeaveGroupChatSuccessfullAPIResponse, ISendMessageSuccessfullAPIResponse } from '../../shared/models/IChatAPIResponses';

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

  sendMessage(content: string, muiltiMediaFiles: File | undefined, type: "text" | "image" | "video" | "document" | "audio" | "voiceRecord", chatId: string): Observable<ISendMessageSuccessfullAPIResponse> {
   const api: string = `${this.backendDomain}${UserAPIEndPoint.SEND_MESSAGE}${chatId}`;

   const body: FormData = new FormData();

   if(content) {
    body.append("content", content);
  }else if(muiltiMediaFiles) {
     body.append("muiltiMediaFiles", muiltiMediaFiles, muiltiMediaFiles.name);
   }

   body.append("type", type);
   
   const sendMessageAPIResponse$: Observable<ISendMessageSuccessfullAPIResponse> = this.httpClient.post<ISendMessageSuccessfullAPIResponse>(api, body);

   return sendMessageAPIResponse$;
  }

  createNewGroupChat(groupName: string, groupMembers: string[]): Observable<ICreateNewGroupSuccessfullAPIResponse> {
    const api: string = `${this.backendDomain}${UserAPIEndPoint.CREATE_NEW_GROUP}`;

    const createNewGroupAPIResponse$: Observable<ICreateNewGroupSuccessfullAPIResponse> = this.httpClient.post<ICreateNewGroupSuccessfullAPIResponse>(api, { groupName, groupMembers });

    return createNewGroupAPIResponse$;
  }

  leaveGroupChat(chatId: string): Observable<ILeaveGroupChatSuccessfullAPIResponse> {
    const api: string = `${this.backendDomain}${UserAPIEndPoint.LEAVE_GROUP_CHAT}${chatId}`;

    const leaveGroupChatAPIResponse$: Observable<ILeaveGroupChatSuccessfullAPIResponse> = this.httpClient.patch<ILeaveGroupChatSuccessfullAPIResponse>(api, { chatId });

    return leaveGroupChatAPIResponse$;
  }

  getAllUsersNotPresentInCurrentChat(chatId: string): Observable<IGetAllUsersNotPresentInCurrentGroupSuccessfullAPIResponse> {
    const api: string = `${this.backendDomain}${UserAPIEndPoint.GET_ALL_USERS_NOT_PRESENT_IN_CURRENT_GROUP}${chatId}`;

    const getAllUsersNotPresentInCurrentChatAPIResponse$: Observable<IGetAllUsersNotPresentInCurrentGroupSuccessfullAPIResponse> = this.httpClient.get<IGetAllUsersNotPresentInCurrentGroupSuccessfullAPIResponse>(api);

    return getAllUsersNotPresentInCurrentChatAPIResponse$;
  }

  addNewMembersInGroup(chatId: string, newMembers: string[]): Observable<IAddNewMembersInGroupSuccessfullAPIResponse> {
    const api: string = `${this.backendDomain}${UserAPIEndPoint.ADD_MEMBERS_IN_GROUP}${chatId}`;

    const addNewMemberInGroupAPIResponse$: Observable<IAddNewMembersInGroupSuccessfullAPIResponse> = this.httpClient.patch<IAddNewMembersInGroupSuccessfullAPIResponse>(api, { newMembers });

    return addNewMemberInGroupAPIResponse$;
  }
}