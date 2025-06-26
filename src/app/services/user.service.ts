// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private auth: Auth, private firestore: Firestore) {
    console.log('[UserService] Constructor ejecutado'); // ← Agrega esto
    this.verificarDocumentoUsuario();
  }

  verificarDocumentoUsuario() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const ref = doc(this.firestore, 'users', uid);
        const docSnap = await getDoc(ref);

        if (!docSnap.exists()) {
          await setDoc(ref, {
            uid: uid,
            email: user.email || '',
            username: '',
            createdAt: Timestamp.now()
          });
          console.log('Documento Firestore creado para usuario:', uid);
        } else {
          console.log('Documento ya existe para:', uid);
        }
      }
    });
  }
}
