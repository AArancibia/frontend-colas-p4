import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
/* Routing Module */
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgZorroAntdModule, NZ_I18N, es_ES } from "ng-zorro-antd";
import es from "@angular/common/locales/es";
import { HomeModule } from "./home/home.module";
import { CoreModule } from "./core/core.module";
import { ColasStoreModule } from "@app/store/colas-store.module";
import { AuthenticationModule } from "./authentication/authentication.module";

registerLocaleData(es);

/**
 * The bootstrapper Module
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HomeModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    CoreModule,
    ColasStoreModule,
    AuthenticationModule
  ],
  providers: [{ provide: NZ_I18N, useValue: es_ES }],
  bootstrap: [AppComponent]
})
export class AppModule {}
