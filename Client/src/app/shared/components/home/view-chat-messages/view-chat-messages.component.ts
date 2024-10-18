import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// services
import { SocketIoService } from '../../../../core/services/socket-io.service';

// interfaces
import { IChatWithParticipantDetails } from '../../../models/IChat.entity';

// pipes
import { GetReciverProfileDataPipe } from '../../../pipes/get-reciver-profile-data.pipe';

// enums
import { ChatEventEnum } from '../../../../core/constants/socketEvents.constants';

@Component({
  selector: 'app-view-chat-messages',
  standalone: true,
  imports: [
    GetReciverProfileDataPipe
  ],
  templateUrl: './view-chat-messages.component.html',
  styleUrl: './view-chat-messages.component.css'
})
export class ViewChatMessagesComponent {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private socketIoService: SocketIoService = inject(SocketIoService);

  chat: IChatWithParticipantDetails | undefined;
  
  private roomId: string;

  constructor() {
    this.roomId = this.activatedRoute.snapshot.params["roomId"];
  }
  private joinChat() {
    this.socketIoService.emit<string>(ChatEventEnum.JOIN_CHAT_EVENT, this.roomId);
  }
}