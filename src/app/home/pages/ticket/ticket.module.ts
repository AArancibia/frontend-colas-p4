import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '@app/shared/shared.module';
import {TicketComponent} from '@app/home/pages/ticket/ticket.component';

import { TicketRoutingModule } from './ticket-routing.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {SnackbarModule} from 'ngx-snackbar';

@NgModule({
  declarations: [ TicketComponent ],
  imports: [
    CommonModule,
    TicketRoutingModule,
    NgZorroAntdModule,
    SharedModule,
    SnackbarModule.forRoot()
  ],
  exports: [ TicketComponent ],
})
export class TicketModule { }
