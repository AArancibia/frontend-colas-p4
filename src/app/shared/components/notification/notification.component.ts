import {Component, OnInit, TemplateRef} from '@angular/core';
import {NzNotificationService} from 'ng-zorro-antd';
import {WebsocketService} from '../../../core/services/websocket/websocket.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(
    private wsSocket: WebsocketService,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
  }

}
