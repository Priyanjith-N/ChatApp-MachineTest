import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

// service
import { UserService } from '../../../../core/services/user.service';
import { UserProfileManagementService } from '../../../../core/services/user-profile-management.service';

// interfaces
import { ILogoutSuccessfullAPIResponse } from '../../../models/IUserAPIResponses';
import { IUserProfile } from '../../../models/user.entity';
import { SocketIoService } from '../../../../core/services/socket-io.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private userService: UserService = inject(UserService);
  private socketIoService: SocketIoService = inject(SocketIoService);
  private userProfileManagementService: UserProfileManagementService = inject(UserProfileManagementService);
  private router: Router = inject(Router);
  private userProfileManagement: UserProfileManagementService = inject(UserProfileManagementService);

  isLogginOut: boolean = false;
  userProfile: IUserProfile | null = null;

  ngOnInit(): void {
    this.userProfileManagement.userProfile$.subscribe({
      next: (value) => {
        this.userProfile = value;
      }
    });
  }

  logout() {
    if(this.isLogginOut) return;

    this.isLogginOut = true;

    const logoutAPIResponse$: Observable<ILogoutSuccessfullAPIResponse> = this.userService.handelLogout();

    this.socketIoService.disconnect(); // disconnect

    logoutAPIResponse$.subscribe({
      next: (res) => {
        this.isLogginOut = false;
        this.userProfileManagementService.set(null);
        this.router.navigate(["/auth/login"]); // after sucessfull logging out redirect to login
      },
      error: (err) => {  }
    });
  }
}
