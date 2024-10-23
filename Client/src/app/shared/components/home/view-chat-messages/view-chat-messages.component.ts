import { AfterViewChecked, AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// services
import { SocketIoService } from '../../../../core/services/socket-io.service';
import { ChatService } from '../../../../core/services/chat.service';
import { UserProfileManagementService } from '../../../../core/services/user-profile-management.service';

// interfaces
import { IMessagesGroupedByDate, IMessageWithSenderDetails } from '../../../models/message.entity';
import { IGetMessagessOfChatSuccessfullAPIResponse, ISendMessageSuccessfullAPIResponse } from '../../../models/IChatAPIResponses';
import { IChatWithParticipantDetails, JoinChatMessageRead } from '../../../models/IChat.entity';
import { IUserProfile } from '../../../models/user.entity';

// pipes
import { GetReciverProfileDataPipe } from '../../../pipes/get-reciver-profile-data.pipe';

// enums
import { ChatEventEnum } from '../../../../core/constants/socketEvents.constants';
import { FormateTimePipe } from '../../../pipes/formate-time.pipe';
import { DateFormaterForChatPipe } from '../../../pipes/date-formater-for-chat.pipe';

import { Database, Picker } from 'emoji-picker-element';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-chat-messages',
  standalone: true,
  imports: [
    GetReciverProfileDataPipe,
    FormateTimePipe,
    DateFormaterForChatPipe,
    ReactiveFormsModule,
    CommonModule
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
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  @ViewChild("chatMessageInput")
  private chatMessageInput!: ElementRef<HTMLInputElement>;

  @ViewChild("emojiDiv")
  private emojitDiv!: ElementRef<HTMLDivElement>;
  
  @ViewChild("viewChatDiv")
  private viewChatDiv!: ElementRef<HTMLDivElement>;

  @ViewChild("fileUpload")
  private fileUpload!: ElementRef<HTMLInputElement>;

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

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

    this.socketIoService.on<JoinChatMessageRead>(ChatEventEnum.MESSAGE_READ_EVENT).subscribe({
      next: ({ updatedChat, messageReadedUserId }) => { // this will only emited by other person when he or she is in the room or cliked your chat
        for(const dayMessage of this.messages) {
          for(const message of dayMessage.messages) {
            if(!message.messageReadedParticipants.includes(messageReadedUserId)) { // need to add user to the messages where seen by him 
              const newReadedParticipantsLength = message.messageReadedParticipants.push(messageReadedUserId);

              if(newReadedParticipantsLength === updatedChat.participants.length) { // if the readed length is equal to the number of users present then all of them readed so make blue tick
                message.isRead = true;
              }
            }
          }
        }
      },
      error: (err) => {  }
    });

    this.socketIoService.on<IMessageWithSenderDetails>(ChatEventEnum.MESSAGE_RECEIVED_EVENT).subscribe({
      next: (newMessage) => {
        if(newMessage.chatId === this.chat?.chatId){
          if(this.messages.length) {
            this.messages[this.messages.length - 1].messages.push(newMessage); // push to the last messages log
          }else{
            this.messages.push({
              createdAt: newMessage.createdAt,
              messages: [newMessage]
            })
          }
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

  getReciverProfileData(userId: string) {
    return this.chat?.participantsData.find((userProfile) => userProfile._id === userId)!;
  }

  generateLightColorFromString(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    // Extract RGB values from hash and increase brightness
    const r = (hash >> 16) & 0xFF;
    const g = (hash >> 8) & 0xFF;
    const b = hash & 0xFF;
  
    // Adjust to keep colors light (add an offset to each component)
    const lightR = Math.floor((r + 255) / 2); // Brighter Red
    const lightG = Math.floor((g + 255) / 2); // Brighter Green
    const lightB = Math.floor((b + 255) / 2); // Brighter Blue
  
    // Convert back to hex and return the color
    return `#${((1 << 24) + (lightR << 16) + (lightG << 8) + lightB).toString(16).slice(1)}`;
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
    let { content } = this.chatForm.value;
    let type: "text" | "image" | "video" | "document" | "audio" = "text"

    if(!content && !this.selectedFile) return;

    if(this.selectedFile) {
      content = "";

      const fileTypeMap: Record<string, Set<string>> = {
        "image": new Set<string>(["image/png", "image/jpeg", "image/gif", "image/bmp", "image/svg+xml"]),
        "video": new Set<string>(["video/mp4", "video/avi", "video/mov", "video/x-matroska", "video/x-flv"]),
        "document": new Set<string>(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]),
        "audio": new Set<string>(["audio/mpeg", "audio/wav", "audio/x-wav", "audio/ogg", "audio/aac", "audio/flac", "audio/x-ms-wma", "audio/x-aiff", "audio/midi", "audio/x-midi", "audio/webm"])
      };

      // Extract the file extension from the file name
      const mimeType = this.selectedFile.type;

      for(const key in fileTypeMap) {
        if(fileTypeMap[key].has(mimeType)) {
          type = key as "text" | "image" | "video" | "document" | "audio";
          break;
        }
      }

      if(type === "text") return; // invaild type data
    }

    const sendMessageAPIResponse$: Observable<ISendMessageSuccessfullAPIResponse> = this.chatService.sendMessage(content, this.selectedFile, type, this.roomId);

    sendMessageAPIResponse$.subscribe({
      next: (res) => {
        this.chatForm.reset();
        this.selectedFile = undefined;
        if(this.fileUpload) {
          this.fileUpload.nativeElement.value = "";
        }

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