import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

// services
import { UserService } from '../../../../core/services/user.service';

// interfacess
import { IUserProfile } from '../../../models/user.entity';
import { IGetAllUserProfileSuccessfullAPIResponse } from '../../../models/IUserAPIResponses';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewInit {
  private userService: UserService = inject(UserService);

  @ViewChild("search")
  private searchInput!: ElementRef<HTMLInputElement>;

  @ViewChild("searchUserInput", { static: false })
  private searchUserInput!: ElementRef<HTMLInputElement>;

  newChatOrGroupChatModal: boolean = false;
  private listOfUsersData: IUserProfile[] = [];
  displayListOfUsers: IUserProfile[] = [];

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
}
