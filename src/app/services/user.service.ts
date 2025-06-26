import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';
import { AuthStateService } from './auth-state.service'; // importa tu servicio personalizado
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private firestore: Firestore,
    private authState: AuthStateService,
    private router: Router
  ) {
    this.verificarDocumentoUsuario();
  }

  async verificarDocumentoUsuario() {
    const user = this.authState.getCurrentUser(); // 🔥 usar el servicio personalizado

    if (!user) {
      console.warn('[UserService] Usuario no autenticado');
      return;
    }

    const uid = user.uid;
    const ref = doc(this.firestore, 'users', uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        uid,
        email: user.email || '',
        username: '',
        createdAt: Timestamp.now()
      });
      console.log('✅ Documento Firestore creado para usuario:', uid);
      this.router.navigate(['/perfil']);
    } else {
      const data = snap.data();
      if (!data['username'] || data['username'].trim() === '') {
        console.log('⚠️ Username vacío, redirigiendo...');
        this.router.navigate(['/perfil']);
      }
    }
  }
}
