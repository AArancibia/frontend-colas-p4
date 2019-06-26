import { Injectable } from '@angular/core';
import {WebsocketService} from '../websocket/websocket.service';
import {Socket} from 'ngx-socket-io';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Ventanilla} from '@app/core/models/ventanilla.model';
import {EstadoServidor} from '@app/shared/enum/estado-servidor.enum';

@Injectable()
export class VentanillaService extends Socket {
  private api: string = environment.url_server;
  ventanilla: Ventanilla = new Ventanilla();

  public ventanillaS = new BehaviorSubject< any >( Ventanilla );
  public statusV$ = this.ventanillaS.asObservable();

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

  bloquearActivarVentanilla( idventanilla, idestado ) {
    return this.request( 'POST', `ventanilla/${ idventanilla }/estado/${ idestado }`);
  }

  obtenerVentanillaporIdUsuario( idusuario: number ) {
    return this.request( 'GET', `ventanilla/usuario/${ idusuario }`);
  }

  ultimoEstado(
    idventanilla: number,
  ) {
    return this.request( 'GET', `ventanilla/${ idventanilla }/ultimoestado` );
  }
}
