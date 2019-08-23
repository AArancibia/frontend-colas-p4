import { Usuario } from "@app/core/models/usuario.model";
import { Ventanilla } from '@app/core/models/ventanilla.model';

export class AuthDTO {
  username: string;
  password: string;
}

export class AuthRO {
  constructor(public usuario?: Usuario, public token?: string,  public ventanilla?: Ventanilla) {}
}
