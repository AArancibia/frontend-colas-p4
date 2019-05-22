import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TicketRoutingModule} from '@app/home/pages/ticket/ticket-routing.module';
import {StoreModule} from '@ngrx/store';
import {ticketReducer} from '@app/features/ticket-store/state/ticket.reducer';
import {EffectsModule} from '@ngrx/effects';
import {TicketEffect} from '@app/features/ticket-store/state/ticket.effect';
import * as fromTicketStore from './state/';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TicketRoutingModule,
    StoreModule.forFeature( 'tickets', fromTicketStore.reducers ),
    EffectsModule.forFeature( [ TicketEffect ] ),
  ]
})
export class TicketStoreModule { }
