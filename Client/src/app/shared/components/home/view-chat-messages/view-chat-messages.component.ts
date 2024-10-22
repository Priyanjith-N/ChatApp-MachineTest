import { AfterViewChecked, AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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

import { Database, Picker } from 'emoji-picker-element';

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
export class ViewChatMessagesComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  private chatService: ChatService = inject(ChatService);
  private userProfileManagementService: UserProfileManagementService = inject(UserProfileManagementService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private socketIoService: SocketIoService = inject(SocketIoService);
  private router: Router = inject(Router);
  private currentUserProfile: IUserProfile | null = null;

  @ViewChild("chatMessageInput")
  private chatMessageInput!: ElementRef<HTMLInputElement>;

  @ViewChild("emojiDiv")
  private emojitDiv!: ElementRef<HTMLDivElement>;
  
  @ViewChild("viewChatDiv")
  private viewChatDiv!: ElementRef<HTMLDivElement>;

  chat: IChatWithParticipantDetails | undefined;
  messages: IMessagesGroupedByDate[] = [];
  chatForm: FormGroup;
  selectedFile: File | undefined;

  private emojiPicker: Picker;
  showEmojiPicker: boolean = false;
  
  
  private roomId: string = "";

  constructor() {
    this.emojiPicker = new Picker();

    this.userProfileManagementService.userProfile$.subscribe({
      next: (user) => {
        this.currentUserProfile = user;
      }
    });

    this.chatForm = new FormGroup({
      content: new FormControl("")
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  showOrCloseEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  ngAfterViewInit(): void {
    this.chatMessageInput.nativeElement.focus();

    this.emojitDiv.nativeElement.appendChild(this.emojiPicker);

    this.emojiPicker.addEventListener('emoji-click', (event: any) => {
      const message = this.chatForm.value.content;

      if(message) {
        this.chatForm.get("content")?.setValue(message + event.detail.unicode);
      }else{
        this.chatForm.get("content")?.setValue(event.detail.unicode);
      }
    });
  }

  clearAll() {
    this.chat = undefined;
    this.messages = [];
    this.chatForm.reset();
    this.selectedFile = undefined;
  }

  initElements() {
    this.roomId = this.activatedRoute.snapshot.params["roomId"];
    
    if(!this.currentUserProfile) {
      this.leaveRoom();
      this.router.navigate(["/"]);
      return;
    }

    this.getMessages(); // get all messages for this chat
  }

  leaveRoom() {
    if(this.roomId) {
      this.socketIoService.emit<string>(ChatEventEnum.LEAVE_CHAT_EVENT, this.roomId);
    }
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        const currentRoomId = params.get("roomId");

        if(!currentRoomId) {
          this.leaveRoom();
          this.router.navigate(["/chat"]);
          return;
        }

        if(currentRoomId !== this.roomId) {
          this.leaveRoom();
          this.clearAll();
        }

        this.initElements();
      }
    });

    this.socketIoService.on<string>(ChatEventEnum.MESSAGE_READ_EVENT).subscribe({
      next: (chatId) => { // this will only emited by other person when he or she is in the room or cliked your chat
        for(const dayMessage of this.messages) {
          for(const message of dayMessage.messages) {
            message.isRead = true;
          }
        }
      },
      error: (err) => {  }
    });

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

  ngOnDestroy(): void {
    this.leaveRoom();
  }

  scrollToBottom() {
    if (this.viewChatDiv) {
      this.viewChatDiv.nativeElement.scrollTop = this.viewChatDiv.nativeElement.scrollHeight;
    }
  }

  private getMessages() {
    const getMessagesOfChatAPIResponse$: Observable<IGetMessagessOfChatSuccessfullAPIResponse> = this.chatService.getMessagesOfChat(this.roomId);

    getMessagesOfChatAPIResponse$.subscribe({
      next: (res) => {
        this.chat = res.data.chat;
        this.messages = res.data.messages;
        this.joinChat(); // join the chat. chat is vaild 
        this.chatMessageInput.nativeElement.focus();
      },
      error: (err) => {  }
    });
  }

  private joinChat() {
    this.socketIoService.emit<string>(ChatEventEnum.JOIN_CHAT_EVENT, this.roomId);
  }

  isMessagedByCurrentUser(message: IMessageWithSenderDetails) {
    if(!this.currentUserProfile) {
      this.leaveRoom();
      this.router.navigate(["/chat"]);
      return;
    }
    return message.senderId === this.currentUserProfile._id;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  sendMessage() {
    const { content } = this.chatForm.value;

    if(!content && !this.selectedFile) return;

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