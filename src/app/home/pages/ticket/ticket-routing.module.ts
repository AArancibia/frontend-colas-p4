import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TicketComponent} from '@app/home/pages/ticket/ticket.component';
import {SatisfaccionComponent} from '@app/home/pages/ticket/satisfaccion/satisfaccion.component';

const routes: Routes = [
  {
    path: '',
    component: TicketComponent,
  },
  {
    path: 'satisfaccion',
    component: SatisfaccionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
