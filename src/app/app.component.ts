import {Component, OnInit} from '@angular/core';
import {WebsocketService} from './core/services/websocket/websocket.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {TicketSocketService} from './core/services/ticket/ticket-socket.service';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend-colas';
  constructor(
    public wsService: WebsocketService,
    public ticketSocketService: TicketSocketService,
    private notification: NzNotificationService,
  ) {}

  ngOnInit(): void {
    this.ticketSocketService.getTickets()
      .subscribe(
        tap(
          () => {
            this.notification.create('success', 'NuevoTicket', '' );
          },
        ),
        () => {},
        () => {}
      );
  }

}
