import { Injectable } from '@angular/core';

import socketio, { Socket } from "socket.io-client";

import { environment } from '../../../environments/environment'; // load environment variables
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatEventEnum } from '../constants/socketEvents.constants';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socketio: Socket;
  private onlineUsersIdsSubject: BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(new Set<string>());
  onlineUsersIdsObservable$: Observable<Set<string>> = this.onlineUsersIdsSubject.asObservable();

  constructor() {
    this.socketio = socketio(environment.BACKEND_DOMAIN, {
      withCredentials: true
    });

    this.on<string[]>(ChatEventEnum.ONLINE_USERS_LIST_CHANGE).subscribe({
      next: (newOnlineUsersList) => {
        this.onlineUsersIdsSubject.next(new Set<string>(newOnlineUsersList));
      }
    });
  }

  emit<T>(event: string, payload: T) {
    this.socketio.emit(event, payload);
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>(observer => {
      this.socketio.on(event, (response: T) => {
        observer.next(response);
      });
    });
  }

  connect() {
    if (!this.socketio.connected) {
      this.socketio.connect(); // Connect only if not already connected
    }
  }

  disconnect() {
    if (this.socketio.connected) {
      this.socketio.disconnect(); // Disconnect the socket
    }
  }
}
