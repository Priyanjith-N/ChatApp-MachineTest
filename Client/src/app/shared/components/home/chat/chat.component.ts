import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

// services
import { UserService } from '../../../../core/services/user.service';
import { ChatService } from '../../../../core/services/chat.service';
import { SocketIoService } from '../../../../core/services/socket-io.service';

// interfacess
import { IUserProfile } from '../../../models/user.entity';
import { IGetAllUserProfileSuccessfullAPIResponse } from '../../../models/IUserAPIResponses';
import { ICreateNewChatSuccessfullAPIResponse } from '../../../models/IChatAPIResponses';
import { IChatWithParticipantDetails } from '../../../models/IChat.entity';
import { ChatEventEnum } from '../../../../core/constants/socketEvents.constants';
import { Router, RouterOutlet } from '@angular/router';
import { FormateTimePipe } from '../../../pipes/formate-time.pipe';
import { GetReciverProfileDataPipe } from '../../../pipes/get-reciver-profile-data.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormateTimePipe,
    GetReciverProfileDataPipe,
    RouterOutlet
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewInit, OnInit {
  private userService: UserService = inject(UserService);
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

  ngOnInit(): void {
    this.socketIoService.on<IChatWithParticipantDetails>(ChatEventEnum.NEW_CHAT_EVENT).subscribe({
      next: (chat) => {
        this.newChatOrGroupChatModal = false;

        const isChatExist = this.chatListsData.find((presentChat) => presentChat._id === chat._id);

        if(!isChatExist) {
          this.chatListsData = [chat, ...this.chatListsData];
          this.displayChatLists = this.chatListsData;
        }

        this.router.navigate(["/chat", chat._id]);
      },
      error: (err) => { 
        this.newChatOrGroupChatModal = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.searchInput.nativeElement.focus();
  }

  stopEventBubbleing(event: Event) {
    event.stopImmediatePropagation();
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

        this.router.navigate(["/chat", chat._id]);
      },
      error: (err) => { 
        this.newChatOrGroupChatModal = false;
      }
    });
  }
}
