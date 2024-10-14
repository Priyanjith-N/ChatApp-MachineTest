import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';

// services
import { UserProfileManagementService } from '../../services/user-profile-management.service';
import { UserService } from '../../services/user.service';

// interfaces
import { IUserProfile } from '../../../shared/models/user.entity';
import { IGetUserProfileSuccessfullAPIResponse } from '../../../shared/models/IUserAPIResponses';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private userProfileManagement: UserProfileManagementService = inject(UserProfileManagementService);

  userProfile: IUserProfile | null = null;

  constructor() {
    this.getUserProfile();
  }

  private getUserProfile() {
    const getUserProfileAPIResponse$: Observable<IGetUserProfileSuccessfullAPIResponse> = this.userService.getUserProfile();

    getUserProfileAPIResponse$.subscribe({
      next: (res) => {
        this.userProfileManagement.set(res.data); // setting user profile data. to access when needed
      },
      error: () => {  }
    });
  }
  
  ngOnInit(): void {
    this.userProfileManagement.userProfile$.subscribe({
      next: (value) => {
        this.userProfile = value;
      }
    });
  }
  
  isRouteActive(route: string): boolean {
    return this.router.isActive(route, { paths: "subset", fragment: "ignored", matrixParams: "ignored", queryParams: "ignored" });
  }
}
