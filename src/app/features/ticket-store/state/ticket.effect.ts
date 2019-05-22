import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {Ticket} from '@app/core/models/ticket.model';
import {Action, Store} from '@ngrx/store';
import {TicketService} from '@app/core/services/ticket/ticket.service';
/*import {
  CreateTicket,
  CreateTicketSuccess,
  LoadTickets,
  LoadTicketsSuccess,
  TicketActionTypes
} from '@app/features/ticket-store/state/ticket.action';*/
import {catchError, map, mergeMap, startWith, switchMap, tap} from 'rxjs/operators';
import {AddError, RemoveError} from '@app/store/actions/error.action';
import {AppState} from '@app/store/colas-store.module';
import {tick} from '@angular/core/testing';
//import {AppState} from '@app/features/ticket-store/state/ticket.type';
import * as ticketAction from '@app/features/ticket-store/state/ticket.action';

@Injectable()
export class TicketEffect {
  /*@Effect()//{ dispatch: false }
  listTickets$ = this.action$
    .pipe(
      ofType( ticketAction.LIST_TICKETS ),
      startWith( new ticketAction.TicketListed() ),
      tap( () => this.ticketService.listTickets() )
    );*/

  constructor(
    private action$: Actions,
    private store: Store< AppState >,
    private ticketService: TicketService,
  ) {}

  /* @Effect()
  ticketListed$: Observable< Action > = this.ticketService
    .ticketListed$
    .pipe(
      switchMap(
        tickets => of( new ticketAction.TicketListed( tickets ) )
      ),
    ); */

  /*@Effect()
  createTicket$: Observable< Action > = this.action$
    .pipe(
      ofType< CreateTicket >( TicketActionTypes.CREATE_TICKET ),
      tap( () => this.store.dispatch( new RemoveError() ) ),
      map( ( action: any ) => action.payload ),
      tap( ( data ) => console.log( data ) ),
      tap( ( ticket ) => this.ticketService.guardarTicket( ticket ) ),
    );

  @Effect()
  loadTickets$: Observable< Action > = this.action$
    .pipe(
      ofType< LoadTickets >( TicketActionTypes.LOAD_TICKETS ),
      tap( () => this.store.dispatch( new RemoveError() ) ),
      mergeMap(
        action => this.ticketService.obtenerTickets()
        .pipe(
          tap( ( ticket ) => console.log( ticket ) ),
          map( ( ticket ) => new LoadTicketsSuccess( ticket )),
          catchError( ( err ) => of( new AddError( err.error ) ))
        )
      )
    );*/


}
