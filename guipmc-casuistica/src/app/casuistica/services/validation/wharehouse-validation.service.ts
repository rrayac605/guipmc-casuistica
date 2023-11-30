import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseWhareHouseValidation } from 'src/app/casuistica/models/validation/responseWharehouseValidation';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ValidationForm } from 'src/app/casuistica/models/validation/validationForm';
import { Login } from 'src/app/common/models/security/login';

@Injectable({
  providedIn: 'root'
})
export class WharehouseValidationService {

  private baseEndpoint = '/msvalidacionAlmacenes/v1/validar';
  private user: Login = new Login();
  constructor(private http: HttpClient) { }

  public validate(form: ValidationForm): Observable<ResponseWhareHouseValidation> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)});
    return this.http.post<ResponseWhareHouseValidation>(this.baseEndpoint, form,
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
