import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ValidationForm } from 'src/app/casuistica/models/validation/validationForm';
import { catchError } from 'rxjs/operators';
import { ResponseValidation } from 'src/app/casuistica/models/validation/responseValidation';
import { Login } from 'src/app/common/models/security/login';

@Injectable({
  providedIn: 'root'
})
export class LocalValidationService {

  private baseEndpoint = '/msvalidacionlocal/v1/validar';
  private user: Login = new Login();
  constructor(private http: HttpClient) { }

  public validate(form: ValidationForm): Observable<ResponseValidation> {
    this.user = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.user.tokenBody.access_token)});
    return this.http.post<ResponseValidation[]>(this.baseEndpoint, form,
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
