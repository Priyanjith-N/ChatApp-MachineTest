import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// interfaces
import { IUserProfile } from '../../shared/models/user.entity';

@Injectable({
  providedIn: 'root'
})
export class UserProfileManagementService {
  private userProfileSubject = new BehaviorSubject<IUserProfile | null>(null);

  userProfile$ = this.userProfileSubject.asObservable();

  set(value: IUserProfile | null) {
    this.userProfileSubject.next(value);
  }

  isNull(): boolean {
    if(!this.userProfileSubject.getValue()) return true;

    return false;
  }

  get(): IUserProfile {
    return this.userProfileSubject.getValue()!;
  }
}
