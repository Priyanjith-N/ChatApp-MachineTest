import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

// services
import { UserService } from '../../../../core/services/user.service';
import { ChatService } from '../../../../core/services/chat.service';
import { SocketIoService } from '../../../../core/services/socket-io.service';

// interfacess
import IUser, { IUserProfile } from '../../../models/user.entity';
import { IGetAllUserProfileSuccessfullAPIResponse } from '../../../models/IUserAPIResponses';
import { ICreateNewChatSuccessfullAPIResponse, ICreateNewGroupSuccessfullAPIResponse, IGetAllChatsSuccessfullAPIResponse } from '../../../models/IChatAPIResponses';
import { IChatWithParticipantDetails, JoinChatMessageRead } from '../../../models/IChat.entity';
import { ChatEventEnum } from '../../../../core/constants/socketEvents.constants';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GetReciverProfileDataPipe } from '../../../pipes/get-reciver-profile-data.pipe';
import { FormateTimePipe } from '../../../pipes/formate-time.pipe';
import { UserProfileManagementService } from '../../../../core/services/user-profile-management.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    GetReciverProfileDataPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormateTimePipe,
    ReactiveFormsModule
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
  newGroupChatModal: boolean = false;
  createGroupModal: boolean = false;
  private chatListsData: IChatWithParticipantDetails[] = [];
  displayChatLists: IChatWithParticipantDetails[] = [];
  private listOfUsersData: IUserProfile[] = [];
  displayListOfUsers: IUserProfile[] = [];
  currentUserProfile: IUserProfile | null = null;

  groupMembers: string[] = [];
  newGroupForm: FormGroup;

  constructor() {
    this.newGroupForm = new FormGroup({
      groupName: new FormControl("", [Validators.required])
    });

    this.getAllChats();
  }

  createNewGroupModal() {
    this.createGroupModal = true;
  }

  searchUserInChat(event: Event) {
    const inputElement: HTMLInputElement = event.target as HTMLInputElement;

    const searchText: string = inputElement.value.toLowerCase();

    this.displayChatLists = this.chatListsData.filter((chat) => {
      const getReciverProfileData = this.getReciverProfileData(chat);
      return getReciverProfileData && (getReciverProfileData.displayName.toLowerCase().startsWith(searchText) || getReciverProfileData.phoneNumber.startsWith(searchText));
    })
  }

  isInNewGroup(userId: string) {
    if(this.groupMembers.find((_id) => _id === userId)) return true;
    return false;
  }

  addToGroupMember(userId: string) {
    if(this.isInNewGroup(userId)) {
      this.groupMembers = this.groupMembers.filter((_id) => _id !== userId); // remove added user
    }else{
      this.groupMembers.push(userId); // addes new member
    }
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

        if(((chat.type === "one-to-one") && chat.lastMessage) || (chat.type === "group")) {
          const chatsWithoutEmitedChat = this.chatListsData.filter((currentChat) => currentChat._id !== chat._id);
          this.chatListsData = [chat, ...chatsWithoutEmitedChat];
          this.displayChatLists = this.chatListsData;
        }
      },
      error: (err) => { 
        this.newChatOrGroupChatModal = false;
      }
    });

    this.socketIoService.on<JoinChatMessageRead>(ChatEventEnum.MESSAGE_READ_EVENT).subscribe({
      next: ({ updatedChat, messageReadedUserId }) => {
        const idxOfCurrentChat = this.chatListsData.findIndex((chat) => chat.chatId === updatedChat.chatId);

        if((idxOfCurrentChat !== -1) && (updatedChat.participants.length === (updatedChat.lastMessageData.messageReadedParticipants.length))) {
          this.chatListsData.splice(idxOfCurrentChat, 1, updatedChat); // relplace old chat with new chat
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

  newGroupChatModalOpen() {
    this.newChatOrGroupChatModal = false;
    this.newGroupChatModal = true;
    setTimeout(() => {
      if (this.searchUserInput) {
        this.searchUserInput.nativeElement.focus();
      }
    });
  }

  openOrCloseNewChatOrGroupChatModal() {
    if(!this.newChatOrGroupChatModal && !this.newGroupChatModal) {
      this.newChatOrGroupChatModal = true;
    }else{
      this.newGroupForm.reset();
      this.newChatOrGroupChatModal = false;
      this.newGroupChatModal = false;
      this.createGroupModal = false;
    }

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

    this.displayListOfUsers = this.listOfUsersData.filter((user) => (user.displayName.toLowerCase().startsWith(searchText) || user.phoneNumber.toLowerCase().startsWith(searchText)));
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
          this.searchInput.nativeElement.value = "";
        }

        this.router.navigate(["/chat", chat.chatId]);
      },
      error: (err) => { 
        this.newChatOrGroupChatModal = false;
      }
    });
  }

  createNewGroup() {
    if(this.newGroupForm.invalid || !this.groupMembers.length) return;

    const groupName: string = this.newGroupForm.value.groupName;

    const createNewGroupAPIResponse$: Observable<ICreateNewGroupSuccessfullAPIResponse> = this.chatService.createNewGroupChat(groupName, this.groupMembers);

    createNewGroupAPIResponse$.subscribe({
      next: (res) => {
        this.openOrCloseNewChatOrGroupChatModal();
        this.groupMembers = [];

        const newGroupChat = res.data;

        this.chatListsData = [newGroupChat, ...this.chatListsData];
        this.displayChatLists = this.chatListsData;
        this.searchInput.nativeElement.value = "";
      },
      error: (err) => {  }
    });
  }
}
