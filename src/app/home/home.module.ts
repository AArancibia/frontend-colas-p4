import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import {FormsModule} from '@angular/forms';
import {HomeRoutingModule} from './home-routing.module';
import {SharedModule} from '../shared/shared.module';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';
import {environment} from '@env/environment';
import {SnackbarModule} from 'ngx-snackbar';

const config: SocketIoConfig = { url: environment.wsUrl , options: {} };

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    SharedModule,
    NgZorroAntdModule,
    SocketIoModule.forRoot( config ),
  ],
  exports: [
    HomeComponent,
  ]
})
export class HomeModule { }
