import { Administrado } from './administrado.model';
import {DetEstadoTicket} from '@app/core/models/detestadoticket.model';

export interface Ticket {
  id: number;
  idtematica: number;
  idventanilla: number;
  administrado: Administrado;
  idtipoticket: number;
  codigo: string;
  urgente: boolean;
  preferencial: boolean;
  correlativo: number;
  fecha: Date | string;
  fechacorta: Date | string;
  detestadotickets: DetEstadoTicket[];
  idtramite: number;
}
