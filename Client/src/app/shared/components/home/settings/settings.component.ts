import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

// service
import { UserService } from '../../../../core/services/user.service';

// interfaces
import { ILogoutSuccessfullAPIResponse } from '../../../models/IUserAPIResponses';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);

  isLogginOut: boolean = false;

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
