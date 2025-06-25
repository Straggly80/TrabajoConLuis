import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private auth = getAuth();
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  /** Observable para suscribirse al usuario actual */
  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  /** Devuelve el usuario actual (sincrónico) */
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  /** UID del usuario actual */
  getUid(): string | null {
    return this.userSubject.value?.uid || null;
  }

  /** Verifica si el usuario está autenticado */
  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  /** Verifica si el usuario ya verificó su correo */
  isEmailVerified(): boolean {
    const user = this.userSubject.value;
    return user ? user.emailVerified : false;
  }

  /** Recarga la información del usuario desde Firebase */
  async reloadUser(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      await user.reload();
      this.userSubject.next(this.auth.currentUser);
    }
  }

  /** Cierra sesión */
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userSubject.next(null);
  }
}
