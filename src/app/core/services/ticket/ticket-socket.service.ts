import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {WebsocketService} from '../websocket/websocket.service';
import {environment} from '../../../../environments/environment';

@Injectable()
export class TicketSocketService extends Socket {

  constructor(
    private wsService: WebsocketService,
  ) {
    super({
      url: environment.wsUrl + '/ticket',
    });
    //this.wsService.socket.ioSocket.nsp = '/ticket';
  }

  tomarIdSocket() {
    this.emit('guardarTicket', {}, ( data ) => console.log( data ) );
  }

  getTickets() {
    return this.fromEvent('nuevoTicket');
  }

}
