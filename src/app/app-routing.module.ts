import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { NopagefoundComponent } from "./shared/nopagefound/nopagefound.component";
import { AuthenticationComponent } from "./authentication/authentication.component";
import { AuthGuard } from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: AppComponent
  },
  {
    path: "authentication",
    component: AuthenticationComponent,
    children: [
      {
        path: "",
        loadChildren:
          "@app/authentication/authentication.module#AuthenticationModule"
      }
    ]
  },
  {
    path: "**",
    component: NopagefoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
