import {Action} from '@ngrx/store';
import {Ticket } from '@app/core/models/ticket.model';

export const LIST_TICKETS = '[TICKET] List'; // client -> socket server (side effect)
export const TICKET_LISTED  = '[TICKET] Listed';         // client -> store

export const ADD_TICKET      = '[TICKET] Add';  // client -> socket server (side effect)
export const TICKET_ADDED    = '[TICKET] Added';          // client -> store

export class ListTickets implements Action {
  readonly type = LIST_TICKETS;
}

export class TicketListed implements Action {
  readonly type = TICKET_LISTED;
  constructor(public payload?: Ticket[] ) {}
}

export class AddTicket implements Action {
  readonly type = ADD_TICKET;
  constructor(public payload?: Ticket ) {}
}

export class TicketAdded implements Action {
  readonly type = TICKET_ADDED;
  constructor(public payload?: Ticket ) {}
}

export type All = ListTickets | TicketListed | AddTicket | TicketAdded;
