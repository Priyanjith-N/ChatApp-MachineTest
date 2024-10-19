import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

// services
import { SocketIoService } from '../../../../core/services/socket-io.service';
import { ChatService } from '../../../../core/services/chat.service';
import { UserProfileManagementService } from '../../../../core/services/user-profile-management.service';

// interfaces
import { IMessagesGroupedByDate, IMessageWithSenderDetails } from '../../../models/message.entity';
import { IGetMessagessOfChatSuccessfullAPIResponse, ISendMessageSuccessfullAPIResponse } from '../../../models/IChatAPIResponses';
import { IChatWithParticipantDetails } from '../../../models/IChat.entity';
import { IUserProfile } from '../../../models/user.entity';

// pipes
import { GetReciverProfileDataPipe } from '../../../pipes/get-reciver-profile-data.pipe';

// enums
import { ChatEventEnum } from '../../../../core/constants/socketEvents.constants';
import { FormateTimePipe } from '../../../pipes/formate-time.pipe';
import { DateFormaterForChatPipe } from '../../../pipes/date-formater-for-chat.pipe';

@Component({
  selector: 'app-view-chat-messages',
  standalone: true,
  imports: [
    GetReciverProfileDataPipe,
    FormateTimePipe,
    DateFormaterForChatPipe,
    ReactiveFormsModule
  ],
  templateUrl: './view-chat-messages.component.html',
  styleUrl: './view-chat-messages.component.css'
})
export class ViewChatMessagesComponent implements OnInit {
  private chatService: ChatService = inject(ChatService);
  private userProfileManagementService: UserProfileManagementService = inject(UserProfileManagementService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private socketIoService: SocketIoService = inject(SocketIoService);
  private router: Router = inject(Router);
  private currentUserProfile: IUserProfile;

  chat: IChatWithParticipantDetails | undefined;
  messages: IMessagesGroupedByDate[] = [];
  chatForm: FormGroup;
  
  
  private roomId: string;

  constructor() {
    this.chatForm = new FormGroup({
      content: new FormControl("")
    });

    this.roomId = this.activatedRoute.snapshot.params["roomId"];
    
    
    this.currentUserProfile = this.userProfileManagementService.get();
    
    if(!this.currentUserProfile) {
      this.router.navigate(["/"]);
      return;
    }

    this.getMessages(); // get all messages for this chat
  }

  ngOnInit(): void {
    this.socketIoService.on<IMessageWithSenderDetails>(ChatEventEnum.MESSAGE_RECEIVED_EVENT).subscribe({
      next: (newMessage) => {
        if(this.messages.length) {
          this.messages[this.messages.length - 1].messages.push(newMessage); // push to the last messages log
        }else{
          this.messages.push({
            createdAt: newMessage.createdAt,
            messages: [newMessage]
          })
        }
      },
      error: (err) => {  }
    });
  }

  private getMessages() {
    const getMessagesOfChatAPIResponse$: Observable<IGetMessagessOfChatSuccessfullAPIResponse> = this.chatService.getMessagesOfChat(this.roomId);

    getMessagesOfChatAPIResponse$.subscribe({
      next: (res) => {
        this.chat = res.data.chat;
        this.messages = res.data.messages;
        this.joinChat(); // join the chat. chat is vaild 
      },
      error: (err) => {  }
    });
  }

  private joinChat() {
    this.socketIoService.emit<string>(ChatEventEnum.JOIN_CHAT_EVENT, this.roomId);
  }

  isMessagedByCurrentUser(message: IMessageWithSenderDetails) {
    return message.senderId === this.currentUserProfile._id;
  }

  sendMessage() {
    const { content } = this.chatForm.value;

    if(!content) return;

    const sendMessageAPIResponse$: Observable<ISendMessageSuccessfullAPIResponse> = this.chatService.sendMessage(content, "text", this.roomId);

    sendMessageAPIResponse$.subscribe({
      next: (res) => {
        this.chatForm.reset();

        const newMessage: IMessageWithSenderDetails = res.data;

        if(this.messages.length) { // if there is any element for single day
          this.messages[this.messages.length - 1].messages.push(newMessage); // push to the last messages log
        }else{ // if not create new
          this.messages.push({
            createdAt: newMessage.createdAt,
            messages: [newMessage]
          })
        }
      },
      error: (err) => {  }
    });
  }
}