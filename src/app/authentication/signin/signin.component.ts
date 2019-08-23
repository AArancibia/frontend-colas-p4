import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthDTO } from "../auth.dto";
import { AuthenticationService } from "../authentication.service";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"]
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;
    const auth: AuthDTO = this.loginForm.getRawValue();
    this.authenticationService
      .login(auth)
      .pipe(tap(() => this.router.navigate(["/ticket"])))
      .subscribe();
  }
}
