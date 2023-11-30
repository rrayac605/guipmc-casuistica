import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ValidationForm } from 'src/app/casuistica/models/validation/validationForm';
import { Login } from 'src/app/common/models/security/login';
import { ResponseAlmacenesBuscarPatron } from '../../models/validation/responseAlamcenesBuscarPatron';

@Injectable({
  providedIn: 'root'
})
export class AlmacenesBuscarPatronService {

  private baseEndpoint = '/msvalidacionAlmacenes/v1/buscarPatron';
  private user: Login = new Login();
  constructor(private http: HttpClient) { }

  public buscarPatron(form: ValidationForm): Observable<ResponseAlmacenesBuscarPatron> {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log("EL END ES  POINT ES VALIDACIONES "+this.baseEndpoint);
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
    });
    return this.http.post<ResponseAlmacenesBuscarPatron>(this.baseEndpoint, form,
      { observe: 'response', headers: httpHeadersAuth }).pipe(
        (response: any) => {
          return response;
        },
        catchError(e => {
          return throwError(e);
        })
      );
  }


}
