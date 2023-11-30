import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { SecurityService } from './common/services/security/security.service';
import { Login } from './common/models/security/login';
import { TokenBody } from './common/models/security/tokenBody';
import { DateUtils } from './common/functions/DateUtils';
import { LifeTimeSessionService } from './common/services/security/life-time-session.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery: any;
declare var $: any;
export let browserRefresh = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'guipmc-casuistica';
  subscription: Subscription;

  constructor(private router: Router, private securityService: SecurityService,
              private lifeTimeSessionService: LifeTimeSessionService, private spinner: NgxSpinnerService) {
    this.subscription = router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          browserRefresh = !router.navigated;
        }
    });
    this.handleSessionValidity();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public showSessionDialog() {
    let timerInterval;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-default'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Tu sesión expirara en:',
      html: '<b></b> segundos. </br> <p>¿Quieres mantener la sesión activa?</p>',
      icon: 'warning',
      timer: 60000,
      timerProgressBar: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      onBeforeOpen: () => {
        timerInterval = setInterval(() => {
          const content = Swal.getContent();
          if (content) {
            const b = content.querySelector('b');
            if (b) {
              b.textContent = (Swal.getTimerLeft() / 1000).toString();
            }
          }
        }, 100);
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.value) {
        this.refreshToken();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.router.navigate(['/login', {}]);
      }
      if (result.dismiss === Swal.DismissReason.timer) {
        this.router.navigate(['/login', {}]);
      }
    });
  }

  refreshToken() {
    this.spinner.show();
    const user: Login = JSON.parse(localStorage.getItem('user'));
    this.securityService.refresh(user).subscribe((resp: any) => {
      this.spinner.hide();
      const tokenBody: TokenBody = resp.body;
      user.tokenBody = tokenBody;
      localStorage.removeItem('user');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', JSON.stringify(user.tokenBody.access_token));
      localStorage.setItem('refresh_token', JSON.stringify(user.tokenBody.refresh_token));
      const expireSeconds = user.tokenBody.expires_in;
      const expireToken = DateUtils.timeRefresh(new Number(expireSeconds).valueOf());
      localStorage.setItem('expireToken', JSON.stringify(expireToken));
      this.lifeTimeSessionService.updateLifeTime(expireToken);
    }, () => this.spinner.hide(),
    () => this.spinner.hide());
  }

  private handleSessionValidity() {
    this.lifeTimeSessionService.getTimeOutStatus()
      .subscribe(this.showSessionDialog.bind(this));
  }

}
