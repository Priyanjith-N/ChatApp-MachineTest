import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

// services
import { UserService } from '../../../../core/services/user.service';
import { ChatService } from '../../../../core/services/chat.service';
import { SocketIoService } from '../../../../core/services/socket-io.service';

// interfacess
import IUser, { IUserProfile } from '../../../models/user.entity';
import { IGetAllUserProfileSuccessfullAPIResponse } from '../../../models/IUserAPIResponses';
import { ICreateNewChatSuccessfullAPIResponse, IGetAllChatsSuccessfullAPIResponse } from '../../../models/IChatAPIResponses';
import { IChatWithParticipantDetails } from '../../../models/IChat.entity';
import { ChatEventEnum } from '../../../../core/constants/socketEvents.constants';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GetReciverProfileDataPipe } from '../../../pipes/get-reciver-profile-data.pipe';
import { FormateTimePipe } from '../../../pipes/formate-time.pipe';
import { UserProfileManagementService } from '../../../../core/services/user-profile-management.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    GetReciverProfileDataPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormateTimePipe
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewInit, OnInit {
  private userService: UserService = inject(UserService);
  private userProfileManagementService: UserProfileManagementService = inject(UserProfileManagementService);
  private chatService: ChatService = inject(ChatService);
  private socketIoService: SocketIoService = inject(SocketIoService);
  private router: Router = inject(Router);

  @ViewChild("search")
  private searchInput!: ElementRef<HTMLInputElement>;

  @ViewChild("searchUserInput", { static: false })
  private searchUserInput!: ElementRef<HTMLInputElement>;

  newChatOrGroupChatModal: boolean = false;
  private chatListsData: IChatWithParticipantDetails[] = [];
  displayChatLists: IChatWithParticipantDetails[] = [];
  private listOfUsersData: IUserProfile[] = [];
  displayListOfUsers: IUserProfile[] = [];
  currentUserProfile: IUserProfile | null = null;

  constructor() {
    this.getAllChats();
  }

  searchUserInChat(event: Event) {
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;

    const searchText: string = inputElement.value.toLowerCase();

    this.displayChatLists = this.chatListsData.filter((chat) => {
      const getReciverProfileData = this.getReciverProfileData(chat);
      return getReciverProfileData && (getReciverProfileData.displayName.toLowerCase().startsWith(searchText) || getReciverProfileData.phoneNumber.startsWith(searchText));
    })
  }

  private getAllChats() {
    const getALLChatsAPIResponse$: Observable<IGetAllChatsSuccessfullAPIResponse> = this.chatService.getAllChats();

    getALLChatsAPIResponse$.subscribe({
      next: (res) => {
        this.chatListsData = res.data;
        this.displayChatLists = this.chatListsData;
      },
      error: (err) => {  }
    })
  }

  ngOnInit(): void {
    this.userProfileManagementService.userProfile$.subscribe({
      next: (userProfile) => {
        this.currentUserProfile = userProfile;
      }
    });

    this.socketIoService.on<IChatWithParticipantDetails>(ChatEventEnum.NEW_CHAT_EVENT).subscribe({
      next: (chat) => {
        this.newChatOrGroupChatModal = false;

        if(chat.lastMessage) {
          const chatsWithoutEmitedChat = this.chatListsData.filter((currentChat) => currentChat._id !== chat._id);
          this.chatListsData = [chat, ...chatsWithoutEmitedChat];
          this.displayChatLists = this.chatListsData;
        }
      },
      error: (err) => { 
        this.newChatOrGroupChatModal = false;
      }
    });

    this.socketIoService.on<string>(ChatEventEnum.MESSAGE_READ_EVENT).subscribe({
      next: (chatId) => {
        const chatToMakeMessageAsRead = this.chatListsData.find((chat) => chat.chatId === chatId);

        if(chatToMakeMessageAsRead) {
          chatToMakeMessageAsRead.lastMessageData.isRead = true;
        }
      },
      error: (err) => {  }
    });
  }

  getReciverProfileData(chat: IChatWithParticipantDetails) {
    return chat.participantsData.find((userData) => (this.currentUserProfile && (userData._id !== this.currentUserProfile._id)));
  }

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus();
  }

  stopEventBubbleing(event: Event) {
    event.stopImmediatePropagation();
  }

  readChat(chat: IChatWithParticipantDetails) {
    this.displayChatLists = this.chatListsData;
    this.searchInput.nativeElement.value = "";
    chat.unReadMessages = 0;
  }

  openOrCloseNewChatOrGroupChatModal() {
    this.newChatOrGroupChatModal = !this.newChatOrGroupChatModal;

    if(this.newChatOrGroupChatModal) {
      setTimeout(() => {
        if (this.searchUserInput) {
          this.searchUserInput.nativeElement.focus();
        }
      });
    }

    if(!this.listOfUsersData.length) {
      const getAllUsersAPIResponse$: Observable<IGetAllUserProfileSuccessfullAPIResponse> = this.userService.getAllUsers();

      getAllUsersAPIResponse$.subscribe({
        next: (res) => {
          this.listOfUsersData = res.data;
          this.displayListOfUsers = this.listOfUsersData;
        },
        error: (err) => { }
      });
    }
  }

  searchToStartOrCreateNewGroupChatOrChat(event: Event) {
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;

    const searchText: string = inputElement.value.toString();

    this.displayListOfUsers = this.listOfUsersData.filter((user) => (user.userName.toLowerCase().startsWith(searchText) || user.displayName.toLowerCase().startsWith(searchText) || user.phoneNumber.toLowerCase().startsWith(searchText)));
  }

  startNewChat(reciverId: string) {
    const createNewChatAPIResponse$: Observable<ICreateNewChatSuccessfullAPIResponse> = this.chatService.createNewChat(reciverId);

    createNewChatAPIResponse$.subscribe({
      next: (res) => {
        this.newChatOrGroupChatModal = false;
        const chat = res.data;

        const isChatExist = this.chatListsData.find((presentChat) => presentChat._id === chat._id);

        if(!isChatExist) {
          this.chatListsData = [chat, ...this.chatListsData];
          this.displayChatLists = this.chatListsData;
        }

        this.router.navigate(["/chat", chat.chatId]);
      },
      error: (err) => { 
        this.newChatOrGroupChatModal = false;
      }
    });
  }
}
