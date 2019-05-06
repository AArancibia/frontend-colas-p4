import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { CardticketDirective } from './directives/cardticket.directive';
import { CardDirective } from './directives/card.directive';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, NopagefoundComponent, CardticketDirective, CardDirective],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NopagefoundComponent,
    CardticketDirective,
    CardDirective
  ]
})
export class SharedModule { }
