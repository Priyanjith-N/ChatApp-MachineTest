import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// interfaces
import { IChatWithParticipantDetails } from '../../../models/IChat.entity';
import { GetReciverProfileDataPipe } from '../../../pipes/get-reciver-profile-data.pipe';

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

  chat!: IChatWithParticipantDetails;
  
  private roomId: string;

  constructor() {
    this.roomId = this.activatedRoute.snapshot.params['roomId'];
    const state = this.router.getCurrentNavigation()?.extras.state
    
    if(!state) {
      this.router.navigate(["/chat"]);
      return
    }

    this.chat = state["chat"];
  }
}