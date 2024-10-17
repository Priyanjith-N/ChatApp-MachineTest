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

  private UserProfileManagementService: UserProfileManagementService = inject(UserProfileManagementService);
  private router: Router = inject(Router);

  transform(value: IUserProfile[]): IUserProfile | null {
    if(this.UserProfileManagementService.isNull()) {
      this.router.navigate(["/auth/login"]);
      return null;
    }

    const currentUserData = this.UserProfileManagementService.get();

    return value.find((user) => user._id !== currentUserData._id)!;
  }
}
