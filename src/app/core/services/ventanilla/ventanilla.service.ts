import { Injectable } from '@angular/core';
import {WebsocketService} from '../websocket/websocket.service';
import {Socket} from 'ngx-socket-io';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class VentanillaService extends Socket {
  private api: string = environment.url_server;
  constructor(
    private httpClient: HttpClient,
  ) {
    super({
      url: environment.wsUrl + '/ventanilla',
    });
  }

  private request(
    method: string,
    endpoint: string,
    body?: any,
  ): Observable< any > {
    const url = this.api + endpoint;
    return this.httpClient.request( method, `${ url }`, {
      body,
    });
  }

  obtenerVentanillas() {
    return this.request( 'GET', 'ventanilla' );
  }
}
