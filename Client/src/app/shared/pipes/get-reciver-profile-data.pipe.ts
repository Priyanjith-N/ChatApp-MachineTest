import { inject, Pipe, PipeTransform } from '@angular/core';

// services
import { UserProfileManagementService } from '../../core/services/user-profile-management.service';

// interfaces
import { IUserProfile } from '../models/user.entity';
import { Router } from '@angular/router';

@Pipe({
  name: 'getReciverProfileData',
  standalone: true
})
export class GetReciverProfileDataPipe implements PipeTransform {

  private userProfileManagementService: UserProfileManagementService = inject(UserProfileManagementService);
  private router: Router = inject(Router);

  transform(value: IUserProfile[] | undefined): IUserProfile | null | undefined {
    if(!value) return;

    if(this.userProfileManagementService.isNull()) {
      this.router.navigate(["/chat"]);
      return null;
    }

    const currentUserData = this.userProfileManagementService.get();

    return value.find((user) => user._id !== currentUserData._id)!;
  }
}
