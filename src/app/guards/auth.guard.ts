import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user && user.emailVerified) {
          resolve(true);
        } else {
          resolve(this.router.createUrlTree(['/login']));
        }
      });
    });
  }
}
