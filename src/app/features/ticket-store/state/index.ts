import {EntityState} from '@ngrx/entity';
import {Ticket} from '@app/core/models/ticket.model';
import * as fromTickets from './ticket.reducer';
import * as fromRoot from '@app/store/colas-store.module';
import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface TicketState {
  tickets: fromTickets.TicketState;
}

export interface State extends fromRoot.AppState {
  tickets: TicketState;
}

export const reducers = {
  tickets: fromTickets.ticketReducer
};

export const getTicketsRootState = createFeatureSelector<TicketState>( 'tickets');
export const getTicketsState = createSelector(getTicketsRootState, ( ticketState: TicketState) => ticketState.tickets );

export const getEntitiesArray = createSelector( getTicketsState, fromTickets.getEntitiesArray );

