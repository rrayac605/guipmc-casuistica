import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { SecurityService } from '../services/security/security.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Login } from '../models/security/login';

const httpHeaders = new HttpHeaders({status: '200'});

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    public user: Login = new Login();
    public expireToken;
    constructor(private router: Router, private securityService: SecurityService, private spinner: NgxSpinnerService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user !== undefined && this.user !== null) {
      const token = this.user.tokenBody.access_token;
      if (token) {
          req = req.clone({
              setHeaders: {
                Authorization: ('Bearer ' + token).replace("\"", "").replace("\"", "")
              }
          } );
      }
    }

        this.expireToken = new Number(JSON.parse(localStorage.getItem('expireToken')));
        this.expireToken = this.expireToken + 80000;
    const timeRemaining = this.expireToken - new Date().getTime();

    if (timeRemaining < 0) {
      console.log('hora actual  ' +  new Date().getTime());
      console.log("time:" + timeRemaining);
      console.log('resultado de la resta de hora actual y time  ' + (this.expireToken - new Date().getTime()));
      console.log("Su sesion ha expirado");
          //this.router.navigate(['/login', {}]);
          this.securityService.cleanItems();
        }

        return next.handle(req).catch(err => {
            console.log(err);
            if (err.status === 403) {
                if (err.message.includes('Forbidden')) {
                  this.securityService.cleanItems();
                } else {
                  if (timeRemaining < 0) {
                    this.securityService.cleanItems();
                  }
                }
            }else if (err.status === 401) {
              console.log('err.status === 401 ---- el token ha expirado necesitas mandar a llamar un token  ');
            } else if (err.status === 500) {
              console.log(err.status + ': ha ocurrido un error en el servidor ');

            } else if (err.status === 504) {
              console.log(err.status + ': el servicio tomo mas tiempo de lo necesario');
            }
            return Observable.throw(err);
        });


    }





}
