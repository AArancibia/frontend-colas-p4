import {Component, OnInit} from '@angular/core';
import {WebsocketService} from './core/services/websocket/websocket.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {TicketService} from '@app/core/services/ticket/ticket.service';
import {Ticket} from '@app/core/models/ticket.model';
import {NotificacionService} from '@app/shared/components/notification/notificacion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend-colas';
  constructor(
    public wsSocket: WebsocketService,
    public ticketSocketService: TicketService,
    private notificationService: NotificacionService,
  ) {
    this.verificarEstadoServidor();
  }

  ngOnInit(): void {

  }

  verificarEstadoServidor() {
    this.wsSocket.status$.subscribe(
      estado => {
        switch ( estado ) {
          case 2 : {
            this.notificationService.messageOnline();
            break;
          }
          case 3 : {
            this.notificationService.messageOffline();
            break;
          }
          default:
            this.notificationService.messageOffline();
            break;
        }
      }
    );
  }

}
