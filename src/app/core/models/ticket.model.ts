import { Administrado } from './administrado.model';
import {DetEstadoTicket} from '@app/core/models/detestadoticket.model';
import {Tipoticket} from '@app/core/models/tipoticket.model';

export interface Ticket {
  id: number;
  idtematica: number;
  idventanilla: number;
  administrado: Administrado;
  idtipoticket: number;
  tipoTicket: Tipoticket;
  codigo: string;
  urgente: boolean;
  preferencial: boolean;
  correlativo: number;
  fecha: Date | string;
  fechacorta: Date | string;
  detEstados: DetEstadoTicket[];
  idtramite: number;
  estadosIds: any[];
}
