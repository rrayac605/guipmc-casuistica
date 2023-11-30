import { Injectable } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LifeTimeSessionService {

  private lifeTimeToken: number;
  private sessionTimeOut$ = new Subject<number>();
  private counterSus$: Subscription;

  public getTimeOutStatus() {
    return this.sessionTimeOut$.asObservable();
  }

  public updateLifeTime(lifeTime: number) {
    this.lifeTimeToken = lifeTime - new Date().getTime();
    console.log(`Se inicia el conteo, se lanzara la alerta en
      ${(this.lifeTimeToken / 1000) / 60} minutos`);
    console.log(`Hora actual ${new Date().toLocaleTimeString()}`);
    this.startCounter();
  }

  private startCounter() {
    this.stopCounter();
    this.counterSus$ = timer(this.lifeTimeToken).subscribe(timerResponse => {
      this.sessionTimeOut$.next();
    });
  }

  private stopCounter() {
    if (this.counterSus$) {
      this.counterSus$.unsubscribe();
      this.counterSus$ = undefined;
    }
  }

  public logOut() {
    console.log('se ejecuto el logout desde life time session service');
    this.stopCounter();
  }

}