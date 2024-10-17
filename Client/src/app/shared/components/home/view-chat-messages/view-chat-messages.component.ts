import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-chat-messages',
  standalone: true,
  imports: [],
  templateUrl: './view-chat-messages.component.html',
  styleUrl: './view-chat-messages.component.css'
})
export class ViewChatMessagesComponent {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  
  private roomId: string;

  constructor() {
    this.roomId = this.activatedRoute.snapshot.params['roomId'];
  }
}