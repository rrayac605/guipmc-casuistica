import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../security/security.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private security: SecurityService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if ( this.security.estaLogueado() ) {
        console.log( 'PASO EL GUARD');
        return true;
      } else {
        console.log( 'Bloqueado por guard' );
        this.router.navigate(['/login', {}]);
        return false;
      }
  }

}
