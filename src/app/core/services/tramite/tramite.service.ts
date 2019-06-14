import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TramiteService {
  private api: string = environment.url_server_tupa;
  constructor(
    private httpClient: HttpClient,
  ) {}

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

  obtenerDetallesDeTramite( idtramite: number ) {
    return this.request( 'GET', `tramite/${ idtramite }/detalles` );
  }
}
