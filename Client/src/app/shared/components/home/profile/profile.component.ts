import { Component, inject, OnInit } from '@angular/core';

// services
import { UserProfileManagementService } from '../../../../core/services/user-profile-management.service';

// interfaces
import { IUserProfile } from '../../../models/user.entity';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private userProfileManagement: UserProfileManagementService = inject(UserProfileManagementService);

  userProfile: IUserProfile | null = null;

  ngOnInit(): void {
    this.userProfileManagement.userProfile$.subscribe({
      next: (value) => {
        this.userProfile = value;
      }
    });
  }
}
