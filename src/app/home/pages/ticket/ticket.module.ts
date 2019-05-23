import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SharedModule} from '@app/shared/shared.module';
import {TicketComponent} from '@app/home/pages/ticket/ticket.component';

import { TicketRoutingModule } from './ticket-routing.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {SnackbarModule} from 'ngx-snackbar';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [ TicketComponent ],
  imports: [
    CommonModule,
    FormsModule,
    TicketRoutingModule,
    NgZorroAntdModule,
    SharedModule,
    SnackbarModule.forRoot()
  ],
  exports: [ TicketComponent ],
})
export class TicketModule { }
