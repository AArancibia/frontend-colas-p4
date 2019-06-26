import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private api: string = environment.url_server;
  constructor(
    private httpClient: HttpClient,
  ) { }

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

  filtrarUsuarios( nombreUsuario: string ) {
    return this.request( 'GET', `usuario/${ nombreUsuario }` );
  }

}
