import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TematicaService {
  private apiTupa: string = environment.url_server_tupa;
  constructor(
    private httpClient: HttpClient,
  ) { }

  private request(
    method: string,
    endpoint: string,
    body?: any
  ): Observable< any > {
    const url = this.apiTupa + endpoint;
    return this.httpClient.request( method, `${ url }`, {
      body,
    });
  }

  obtenerTematicas() {
    return this.request( 'GET', 'tematica' );
  }

  tramitesByTematica( tematica: number ) {
    return this.request( 'GET', `tematica/${ tematica }/tramites`);
  }
}
