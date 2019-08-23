import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthenticationService } from "@app/authentication/authentication.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate() {
    if (!this.authenticationService.estaLogueado()) {
      this.router.navigate(["/authentication"]);
      return false;
    }
    return true;
  }
}
