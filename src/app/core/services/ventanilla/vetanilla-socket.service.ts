import { Injectable } from '@angular/core';
import {WebsocketService} from '../websocket/websocket.service';
import {Socket} from 'ngx-socket-io';
import {environment} from '@env/environment';

@Injectable()
export class VetanillaSocketService extends Socket {

  constructor(
    //private wsService: WebsocketService,
  ) {
    super({
      url: environment.wsUrl + '/ventanilla',
    });
  }
}
