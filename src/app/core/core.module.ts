import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WebsocketService} from './services/websocket/websocket.service';
import {TicketService} from './services/ticket/ticket.service';
import { VetanillaSocketService } from './services/ventanilla/vetanilla-socket.service';
import { TematicaService } from './services/tematica/tematica.service';
import { TramiteService } from './services/tramite/tramite.service';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule
  ],
  providers: [
    WebsocketService,
    TicketService,
    VetanillaSocketService,
    TematicaService,
    TramiteService,
  ]
})
export class CoreModule { }
