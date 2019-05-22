import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {ActionReducerMap, StoreModule} from '@ngrx/store';
import {environment} from '@env/environment';
import {errorReducer, ErrorState} from '@app/store/reducers/error.reducer';
import {ticketReducer } from '@app/features/ticket-store/state/ticket.reducer';
import {TicketEffect} from '@app/features/ticket-store/state/ticket.effect';

export interface AppState {
  error: ErrorState;
}

export const reducers: ActionReducerMap< AppState > = {
  error: errorReducer,
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot( reducers ),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot(  [ TicketEffect ] ),
  ]
})
export class ColasStoreModule { }
