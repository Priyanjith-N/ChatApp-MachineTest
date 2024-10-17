import { Injectable } from '@angular/core';

import socketio, { Socket } from "socket.io-client";

import { environment } from '../../../environments/environment'; // load environment variables
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socketio: Socket;

  constructor() {
    this.socketio = socketio(environment.BACKEND_DOMAIN, {
      withCredentials: true
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
}
