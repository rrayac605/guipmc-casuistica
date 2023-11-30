import { Injectable } from '@angular/core';
import { Login } from 'src/app/common/models/security/login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DetalleRegistroDTO } from 'src/app/casuistica/models/validation/detalleRegistroDTO';
import { Observable, throwError } from 'rxjs';
import { ResponseValidation } from 'src/app/casuistica/models/validation/responseValidation';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SuceptibleValidationService {

  private baseEndpoint = '/msvalidaciondupsus/v1/validarSusceptibles';
  private user: Login = new Login();
  constructor(private http: HttpClient) { }

  public validate(form: DetalleRegistroDTO): Observable<ResponseValidation> {

    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json'
      , Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
    });
     console.log("==== EN VALIDATE ES "+form.numNss);

    return this.http.post<ResponseValidation[]>(this.baseEndpoint, form,
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