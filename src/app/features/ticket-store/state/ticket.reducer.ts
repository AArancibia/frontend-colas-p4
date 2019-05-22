import {EntityState} from '@ngrx/entity';
import {Ticket} from '@app/core/models/ticket.model';
import * as ticketActions from './ticket.action';
import {createSelector} from '@ngrx/store';

export interface TicketState {
  ids: string[];
  entities: Ticket[];
  selectedTicketId: number;
  loading: boolean;
  loaded: boolean;
  //tickets: Ticket[];
}

const initialState: TicketState = {
  loaded: false,
  loading: false,
  entities: [],
  ids: [],
  selectedTicketId: 0,
  //tickets: [],
};

export const ticketReducer: ( state: TicketState, action: ticketActions.All ) => TicketState = (
  state = initialState,
  action: ticketActions.All
) => {
  switch ( action.type ) {
    case ticketActions.TICKET_LISTED:
      const ids = Object.keys( action.payload );
      return {
        ...state,
        ids,
        entities: action.payload,
        loading: true,
        loaded: false,
      };
    case ticketActions.TICKET_ADDED:
      return {
        ...state,
        ids: [ ...state.ids, action.payload.idticket ],
        entities: Object.assign({}, state.entities, {[ action.payload.idticket]: action.payload })
      };
    /*case TicketActionTypes.LOAD_TICKETS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        tickets: action.payload,
      };
    case TicketActionTypes.CREATE_TICKET:
      return {
        ...state,
        loading: true,
        loaded: false,
      };
    case TicketActionTypes.CREATE_TICKET_SUCCESS:
      return {
        ...state,
        loading: true,
        loaded: false,
        tickets: [ ...state.tickets, action.payload ],
      };*/
    default:
      return state;
  }
};


export const getEntities = ( state: TicketState ) => state.entities;
export const getIds = ( state: TicketState ) => state.ids;
export const getSelectedId = ( state: TicketState ) => state.selectedTicketId;
export const getSelected = createSelector(
  getEntities,
  getSelectedId,
  ( entities, id ) => entities[id]
);

export const getEntitiesArray = ( state: TicketState ) => state.ids.map( idticket => state.entities[ idticket ]);
