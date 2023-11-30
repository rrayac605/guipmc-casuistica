import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormStatusFile } from 'src/app/casuistica/models/status-file/form-status-file';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/operators';
import { Login } from 'src/app/common/models/security/login';

@Injectable({
  providedIn: 'root'
})
export class FindStatusFileService {

  private baseEndpoint = '/mspmcarchivos/v1/archivos';
  private userLogin: Login = new Login();

  constructor(private http: HttpClient) { }

  public find(formStatus: FormStatusFile): Observable<any> {
    this.userLogin = JSON.parse(localStorage.getItem('user'));
    const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(this.userLogin.tokenBody.access_token)});
    return this.http.post<any>(this.baseEndpoint, formStatus,
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

