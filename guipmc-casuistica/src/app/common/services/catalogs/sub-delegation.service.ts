import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubDelegationService {
  private baseEndpoint = '/serviciosDigitales-rest/v1/catalogos/delegacion/';
  constructor(private http: HttpClient) { }

  public find(cveDelegation: string): Observable<any> {
    return this.http.get<any>(this.baseEndpoint + cveDelegation + '/subDelegacion').pipe(
      (response: any) => {
        return response;
      },
      catchError(e => {
        return throwError(e);
      })
    );
  }
}
