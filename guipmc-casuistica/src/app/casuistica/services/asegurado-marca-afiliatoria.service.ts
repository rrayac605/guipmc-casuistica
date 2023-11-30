import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Login } from 'src/app/common/models/security/login';
import { DetalleRegistroDTO } from '../models/validation/detalleRegistroDTO';
import { ValidationForm } from '../models/validation/validationForm';
@Injectable({
  providedIn: 'root'
})
export class AseguradoMarcaAfiliatoriaService {
  private baseEndpoint = 'msasegurados/v1/obtenerCubetas';
  private user: Login = new Login();
  constructor(private http: HttpClient) { }

  public buscarNssMarcaAfiliatoria(form: ValidationForm): Observable<any> {
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
}
