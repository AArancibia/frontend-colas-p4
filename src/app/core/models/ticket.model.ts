import { Administrado } from './administrado.model';
import {DetEstadoTicket} from '@app/core/models/detestadoticket.model';
import {Tipoticket} from '@app/core/models/tipoticket.model';

/**
 * Ticket Model
 * @interface
 */
export interface Ticket {
  /** Id del Ticket */
  id: number;
  /** Id de Tematica */
  idtematica: number;
  /** Id de Ventanilla */
  idventanilla: number;
  /** Clase Administrado */
  administrado: Administrado;
  /** Id tipo del ticket */
  idtipoticket: number;
  /** Clase TipoTicket */
  tipoTicket: Tipoticket;
  /** Codigo del Ticket */
  codigo: string;
  /** Campo Urgente */
  urgente: boolean;
  /** Campo Preferencial */
  preferencial: boolean;
  /** Correlativo del Ticket */
  correlativo: number;
  /** Fecha del Ticket */
  fecha: Date | string;
  fechacorta: Date | string;
  detEstados: DetEstadoTicket[];
  /** Id del Tramite */
  idtramite: number;
  estadosIds: any[];
}
