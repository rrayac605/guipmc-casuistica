import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { GetCatalogs } from 'src/app/common/models/getcatalogs.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogsService {

  private baseEndpoint = '/mspmccatalogos/v1/catalogos';
  private baseEndpointRegex = '/mspmccatalogos/v1/catalogosRex';

  constructor(private http: HttpClient) { }

  public find(formStatus: GetCatalogs): Observable<any> {
    const userLogin = JSON.parse(localStorage.getItem('user'));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    /* const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(userLogin.tokenBody.access_token)}); */
    return this.http.post<any>(this.baseEndpoint, formStatus,
      {observe: 'response', headers: headers}).pipe(
       (response: any) => {
         return response;
       },
       catchError(e => {
         return throwError(e);
       })
     );
   }

   //***************  BUSQEUDA POR REGEX  *********************/
   public findRegex(formStatus: GetCatalogs): Observable<any> {
    const userLogin = JSON.parse(localStorage.getItem('user'));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    /* const httpHeadersAuth = new HttpHeaders({'Content-Type': 'application/json',
    Authorization: 'Bearer '.concat(userLogin.tokenBody.access_token)}); */
    return this.http.post<any>(this.baseEndpointRegex, formStatus,
      {observe: 'response', headers: headers}).pipe(
       (response: any) => {
         return response;
       },
       catchError(e => {
         return throwError(e);
       })
     );
   }
}
