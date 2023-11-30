import { Injectable } from '@angular/core';
import { DetalleRegistroDTO } from '../../models/validation/detalleRegistroDTO';
import { Login } from 'src/app/common/models/security/login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseValidation } from '../../models/validation/responseValidation';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class SaveNewMovementService {
  private baseEndpoint = '/mscambios/v1/insertarNuevo';
  private baseEndpointSus='/mscambios/v1/insertarNuevoSus';
  private baseEndpointModiSus='/mscambios/v1/modificarCambiosSus';

  private user: Login = new Login();

  constructor(private http: HttpClient) { }

  insertar(form: DetalleRegistroDTO): Observable<ResponseValidation> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
    });
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


  insertarSus(form: DetalleRegistroDTO,pantalla:string): Observable<ResponseValidation> {
      this.user = JSON.parse(localStorage.getItem('user'));
      const httpHeadersAuth = new HttpHeaders({
         'Content-Type': 'application/json',
         Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
      });
    return this.http.post<ResponseValidation[]>(this.baseEndpointSus, form,
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