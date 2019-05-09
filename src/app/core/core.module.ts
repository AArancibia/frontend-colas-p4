import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebsocketService} from './services/websocket/websocket.service';
import {TicketSocketService} from './services/ticket/ticket-socket.service';
import { VetanillaSocketService } from './services/ventanilla/vetanilla-socket.service';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule
  ],
  providers: [
    WebsocketService,
    TicketSocketService,
    VetanillaSocketService,
  ]
})
export class CoreModule { }
