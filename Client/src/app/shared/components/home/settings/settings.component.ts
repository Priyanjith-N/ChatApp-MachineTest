import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

// service
import { UserService } from '../../../../core/services/user.service';
import { UserProfileManagementService } from '../../../../core/services/user-profile-management.service';

// interfaces
import { ILogoutSuccessfullAPIResponse } from '../../../models/IUserAPIResponses';
import { IUserProfile } from '../../../models/user.entity';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  private userService: UserService = inject(UserService);
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

    logoutAPIResponse$.subscribe({
      next: (res) => {
        this.isLogginOut = false;
        this.router.navigate(["/auth/login"]); // after sucessfull logging out redirect to login
      },
      error: (err) => {  }
    });
  }
}
