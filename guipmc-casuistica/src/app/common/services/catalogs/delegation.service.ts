import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DelegationService {

  private baseEndpoint = '/serviciosDigitales-rest/v1/catalogos/delegacion';
  constructor(private http: HttpClient) { }

  public find(): Observable<any> {
    return this.http.get<any>(this.baseEndpoint);
  }

}
