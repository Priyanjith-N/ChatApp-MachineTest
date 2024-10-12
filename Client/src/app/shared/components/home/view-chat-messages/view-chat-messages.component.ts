import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-chat-messages',
  standalone: true,
  imports: [],
  templateUrl: './view-chat-messages.component.html',
  styleUrl: './view-chat-messages.component.css'
})
export class ViewChatMessagesComponent implements OnInit {
  @Input({ required: true }) roomId: string = "";

  ngOnInit(): void {
    console.log(this.roomId, "In view message component");
  }
}
