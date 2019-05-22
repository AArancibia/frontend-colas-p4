import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { CardticketDirective } from './directives/cardticket.directive';
import { CardDirective } from './directives/card.directive';
import {NotificationComponent} from './components/notification/notification.component';
import {SnackbarModule} from 'ngx-snackbar';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NopagefoundComponent,
    CardticketDirective,
    CardDirective,
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    SnackbarModule.forRoot()
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NopagefoundComponent,
    NotificationComponent,
    CardticketDirective,
    CardDirective,
  ]
})
export class SharedModule { }
