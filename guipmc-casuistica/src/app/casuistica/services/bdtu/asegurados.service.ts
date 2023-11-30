import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Login } from 'src/app/common/models/security/login';
import { DetalleRegistroDTO } from '../../models/validation/detalleRegistroDTO';
import { ValidationForm } from '../../models/validation/validationForm';

@Injectable({
  providedIn: 'root'
})
export class AseguradosService {
  
  private baseEndpoint = '/msasegurados/v1/obtener';
  private baseEndpointFBaja = '/msasegurados/v1/obtenerFechaBaja';
  private baseEndpointSinAdscripcion = 'msasegurados/v1/obtenerSinAdscripcion';
  private user: Login = new Login();
  constructor(private http: HttpClient) { }

  //Solo necesita enviar nss
  public buscar(form: ValidationForm): Observable<DetalleRegistroDTO> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
     Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)});
     return this.http.post<DetalleRegistroDTO>(this.baseEndpoint, form,
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
          return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }

  //Asegurados con fecha Baja
  public buscarFechaBaja(form: ValidationForm): Observable<DetalleRegistroDTO> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
     Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)});
     return this.http.post<DetalleRegistroDTO>(this.baseEndpointFBaja, form,
     {observe: 'response', headers: httpHeadersAuth}).pipe(
      (response: any) => {
          return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }

  /*** Asegurados sin adscripcion ***/
  public buscarSinAdscrip(form: ValidationForm): Observable<DetalleRegistroDTO> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)
    });
    return this.http.post<DetalleRegistroDTO>(this.baseEndpointSinAdscripcion, form,
           {observe: 'response', headers: httpHeadersAuth}).pipe(
             (response: any) => {
               return response;
             },
             catchError(e => {
               return throwError(e);
             })
           );
  }

}
