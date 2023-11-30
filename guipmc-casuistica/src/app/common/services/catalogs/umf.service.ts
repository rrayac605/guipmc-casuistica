import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UmfService {
  private baseEndpoint = 'serviciosDigitales-rest/v1/catalogos/subDelegacion/';
  constructor(private http: HttpClient) { }

  public find(cveSubDelegation: string): Observable<any> {
    return this.http.get<any>(this.baseEndpoint + cveSubDelegation + '/umf/nivelAtencion/1');
  }

}
