import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../core/components/navbar/navbar.component';
import { HeaderComponent } from '../../core/components/header/header.component';
import { Router, RouterOutlet } from '@angular/router';

// components
import { ViewChatMessagesComponent } from '../../shared/components/home/view-chat-messages/view-chat-messages.component';

// services
import { SocketIoService } from '../../core/services/socket-io.service';

// enums
import { ChatEventEnum } from '../../core/constants/socketEvents.constants';

// interfaces
import { IJWTAuthError } from '../../shared/models/ISocketEventResponse';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeaderComponent,
    NavbarComponent,
    ViewChatMessagesComponent,
    RouterOutlet
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  private router: Router = inject(Router);
  private socketioService: SocketIoService = inject(SocketIoService);

  ngOnInit() {
    this.socketioService.on<IJWTAuthError | Error>(ChatEventEnum.SOCKET_ERROR_EVENT).subscribe({
      next: (res) => {
        console.log(res);
        
        this.router.navigate(["/auth/login"]);
      },
      error: (err) => { 
        console.log(err);
        
      }
    });
  }
}
