import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormLogin } from 'src/app/common/models/security/formLogin';
import { SecurityService } from 'src/app/common/services/security/security.service';
import { Login } from 'src/app/common/models/security/login';
import { NgxSpinnerService } from 'ngx-spinner';
import { timer } from 'rxjs';
import Swal from 'sweetalert2';
import { TokenBody } from 'src/app/common/models/security/tokenBody';
import { DateUtils } from 'src/app/common/functions/DateUtils';
import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs';
import { LifeTimeSessionService } from 'src/app/common/services/security/life-time-session.service';

declare var $: any;

@Component({
  selector: 'app-log-in-ui',
  templateUrl: './log-in-ui.component.html',
  styleUrls: ['./log-in-ui.component.scss']
})

export class LogInUiComponent implements OnInit, OnDestroy  {
  private subscription: Subscription = new Subscription();

  public contador$: Observable<number>;

  public titDialogo: string;
  public messDialogo: string;

  public formGroup: FormGroup;
  public user: FormControl;
  public pass: FormControl;

  public loginOutput: Login = new Login();

  @ViewChild('userInput', {static: false}) userInput: ElementRef;

  constructor(private formBuilder: FormBuilder, private router: Router,
              private securityService: SecurityService, private spinner: NgxSpinnerService,
              private lifeTimeSessionService: LifeTimeSessionService) {}

  ngOnInit() {
    this.buildForm();
    this.loginOutput = JSON.parse(localStorage.getItem('user'));
    console.log('antes de mandar a llamar a logout');
    console.log('esto es lo que enviamos ');
    console.log(this.loginOutput);
    console.log(this.loginOutput === null);
    if (this.loginOutput === null) {
      console.log('el obj es nulo no enviamos peticion ');
    } else {
      console.log('entraste a llamar a logout *********************');
      this.logOut(this.loginOutput);
    }
    localStorage.clear();
    // $('#headerNav').hide();
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      user: ['', Validators.required],
      pass: ['', Validators.required]
    });
  }

  public showMessage(message: string, title: string) {
    this.titDialogo = title;
    this.messDialogo = message;
    $('#dialogMessage').modal('show');
  }

  public hideMessage() {
    $('#dialogMessage').modal('hide');
  }

  get userForm() { return this.formGroup.get('user') as FormControl; }
  get passForm() { return this.formGroup.get('pass') as FormControl; }

  public validUser() {
    let result = 1;
    if (!this.userForm.value) {
      this.userForm.setValue(this.userInput?.nativeElement?.value);
      this.userForm.updateValueAndValidity();
    }
    if (this.userForm.status !== 'VALID') {
      this.showMessage('CURP requerido', 'Atención');
      result = 0;
    }
    if (this.passForm.status !== 'VALID') {
      this.showMessage('Password requerido', 'Atención');
      result = 0;
    }
    return result;
  }

  public getError(controlName: string): string {
    let error = '';
    const control = this.formGroup.get(controlName);
    if (control.touched && control.errors != null && control.status !== 'VALID') {
      // error = JSON.stringify(control.errors) + control.status;
      error = 'Campo no valido';
    }
    return error;
  }

  public login() {
    const valid = this.validUser();
    const toform = new FormLogin();
    const result = this.formGroup.value;
    toform.usrName = result.user;
    toform.password = result.pass;

    if (valid === 1) {
      this.spinner.show();
      console.log(toform);
      this.securityService.getTokenLogin(toform).subscribe(
        (response: any) => {
          switch (response.status) {
            case 200:
            case 206:
              if (response.body.tokenBody === null) {
                this.spinner.hide();
                this.showMessage('Favor de validar datos ingresados', 'Atención');
                this.router.navigate(['/login', {}]);
              } else {
              this.loginOutput = response.body;
              localStorage.removeItem('user');
              localStorage.setItem('user', JSON.stringify(this.loginOutput));
              localStorage.setItem('access_token', JSON.stringify(this.loginOutput.tokenBody.access_token));
              localStorage.setItem('refresh_token', JSON.stringify(this.loginOutput.tokenBody.refresh_token));

              const expireSeconds = this.loginOutput.tokenBody.expires_in;
              //const expireSeconds = 240;
              const expireToken = DateUtils.timeRefresh(new Number(expireSeconds).valueOf());
              localStorage.setItem('expireToken', JSON.stringify(expireToken));
              this.lifeTimeSessionService.updateLifeTime(expireToken);
              this.redirecting();

              }

              break;
            case 204:
              this.loginOutput = new Login();
              break;
            case 504:
              this.loginOutput = new Login();
              break;
            case 500:
              this.loginOutput = new Login();
              break;
          }
          if (this.loginOutput === null) {
            this.showMessage('Favor de validar datos ingresados', 'Atención');
            this.loginOutput = new Login();
            this.router.navigate(['/login', {}]);
          }
        }, err => {
          this.spinner.hide();
          if (err.status !== null ) {
            switch (err.status) {
              case 401:
                this.showMessage('Sesi\u00f3n no autorizada', 'Atención');
                this.loginOutput = new Login();
                break;
              case 504:
                this.showMessage('Servicio no disponible', 'Atención');
                this.loginOutput = new Login();
                break;
              case 500:
                this.showMessage('Servicio no disponible', 'Atención');
                this.loginOutput = new Login();
                break;
              default:
                this.showMessage('Sesi\u00f3n no autorizada', 'Atención');
                this.loginOutput = new Login();
                break;
            }
          } else {
            this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
          }
        }, () => {
          this.spinner.hide();
        });

    }
  }
public redirecting() {
  this.router.navigate(['/homePage', {}]);
  localStorage.setItem('inicioRouter', '/homePage');
}

public logOut(userLogin: Login) {
  this.lifeTimeSessionService.logOut();
  if (userLogin !== null && userLogin.tokenBody !== null) {
    this.securityService.logout(userLogin).subscribe(
      (response: any) => {
        switch (response.status) {
          case 200:
          case 206:
            console.log('Logout');
            break;
          case 204:
            break;
          case 504:
            break;
          case 500:
            break;
        }
      }, err => {
        this.spinner.hide();
        if (err.status !== null ) {
          switch (err.status) {
            case 401:
              this.showMessage('Sesi\u00f3n no autorizada', 'Atención');
              this.loginOutput = new Login();
              break;
            case 504:
              this.showMessage('Servicio no disponible', 'Atención');
              this.loginOutput = new Login();
              break;
            case 500:
              this.showMessage('Servicio no disponible', 'Atención');
              this.loginOutput = new Login();
              break;
            default:
              this.showMessage('Sesi\u00f3n no autorizada', 'Atención');
              this.loginOutput = new Login();
              break;
          }
        } else {
          this.showMessage('Problemas con el servicio ' + err.message, 'Atención');
        }
      }, () => {
        this.spinner.hide();
      });
  }

}
    ngOnDestroy() {
  }

}
