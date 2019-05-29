import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {BehaviorSubject, Subject} from 'rxjs';
import {EstadoServidor} from '@app/shared/enum/estado-servidor.enum';

@Injectable()
export class WebsocketService {

  public socketStatus = new BehaviorSubject< any >( EstadoServidor );
  public status$ = this.socketStatus.asObservable();

  constructor(
    public socket: Socket
  ) {
    this.checkStatus();
  }

  checkStatus() {
    this.socket.on('connection', ( socketClient ) => {
      console.log( `Cliente Conectado ${ socketClient }` );
      this.socketStatus.next( 2 );
    });
    this.socket.on('disconnect', () => {
      console.log( `Cliente Desconectado` );
      this.socketStatus.next( 3 );
    });
  }

  emit( evento: string, payload: any, callback?: Function ) {
    //this.socket.emit( evento, payload , callback );
  }
}
