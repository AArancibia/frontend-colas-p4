import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, forkJoin} from 'rxjs';
import { DetEstadoTicket } from '@app/core/models/detestadoticket.model';
import {tick} from '@angular/core/testing';

@Injectable()
export class TicketService extends Socket {
  observable: Observable<any>;
  private api: string = environment.url_server;
  constructor(
    private httpClient: HttpClient,
  ) {
    super({
      url: environment.wsUrl + '/ticket',
    });
    //this.wsService.socket.ioSocket.nsp = '/ticket';
  }

  private request(
    method: string,
    endpoint: string,
    body?: any
  ): Observable< any > {
    const url = this.api + endpoint;
    return this.httpClient.request( method, `${ url }`, {
      body,
    });
  }

  // Asignamos la ventanilla en Ticket y guardamos nuevo registro en DetEstadoTicket
  asignarVentanillaAndGuardarDetEstadoTicket( idticket: number, idventanilla: number, detestadoticket: DetEstadoTicket ) {
    return this.request( 'POST', `ticket/${ idticket }/ventanilla/${ idventanilla }`, detestadoticket );
  }

  guardarNuevoEstado( detEstadoTicket: DetEstadoTicket ) {
    return this.request( 'POST', 'ticket/detalle', detEstadoTicket );
  }

  ventanillaAsignadaAlTicket() {
    return this.fromEvent('ventanillaAsignadaAlTicket');
  }

  ticketDerivadoAVentanilla() {
    return this.fromEvent('ticketDerivadoOtraVentanilla');
  }

  obtenerTickets() {
    return this.request( 'GET', 'ticket' );
  }

  obtenerTicketsDia() {
    return this.observable = new Observable( ( observer ) => {
      this.emit('[TICKET] Lista', {}, ( tickets ) => observer.next( tickets ));
    });
  }

  nuevoTicket() {
    return this.fromEvent('nuevoTicket' );
  }

  // Esto va para el administrador
  ticketSinAtender() {
    return this.fromEvent('ticketSinAtender');
  }

}
