import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthStateService } from '../services/auth-state.service'; // ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authStateService.getUser().pipe(
      take(1), // solo espera el primer valor emitido
      map(user => {
        if (user && user.emailVerified) {
          return true;
        }
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
// Este guardia verifica si el usuario está autenticado y tiene su correo verificado.
// Si no está autenticado o el correo no está verificado, redirige a la página de login.