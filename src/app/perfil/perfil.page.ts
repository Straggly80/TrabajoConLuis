import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { onAuthStateChanged } from '@angular/fire/auth';
import { Timestamp } from '@angular/fire/firestore'; // importa Timestamp si no lo tienes


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuarioId: string | null = null;
  showRightBox = false;
  rightBoxTimer: any;

  username: string = '';
  usernameTemp: string = '';
  modoEdicion: boolean = false;
  uid: string | null = null;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private firestore: Firestore
  ) {}

  async ngOnInit() {
  this.usuarioId = this.route.snapshot.paramMap.get('id');

  onAuthStateChanged(this.auth, async (user) => {
    if (user) {
      this.uid = user.uid;

      const ref = doc(this.firestore, 'users', this.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        this.username = snap.data()['username'] || '';
        this.usernameTemp = this.username;
      } else {
        // Si no existe el documento, lo creamos con valores por defecto
        await setDoc(ref, {
          uid: this.uid,
          email: user.email || '',
          username: '',
          createdAt: Timestamp.now()
        });
        this.username = '';
        this.usernameTemp = '';
      }
    } else {
      console.warn('Usuario no autenticado');
      this.router.navigate(['/login']);
    }
  });

  this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe();
}

  async guardarUsername() {
  console.log('intentando guardar...', this.uid, this.usernameTemp);
  if (!this.uid) {
    console.warn('UID no encontrado');
    return;
  }

  try {
    const ref = doc(this.firestore, 'users', this.uid);
    await setDoc(ref, { username: this.usernameTemp }, { merge: true });
    this.username = this.usernameTemp;
    this.modoEdicion = false;
    console.log('Username actualizado correctamente');
  } catch (error) {
    console.error('Error al guardar username:', error);
  }
}


  cancelarEdicion() {
    this.modoEdicion = false;
    this.usernameTemp = this.username;
  }

  toggleRightBox() {
    this.showRightBox = !this.showRightBox;
  }

  cerrarRightBox() {
    this.showRightBox = false;
    clearTimeout(this.rightBoxTimer);
  }

  goFavoritos() {
    this.cerrarRightBox();
    this.router.navigate(['/favoritos']);
  }

  goHome() {
    this.cerrarRightBox();
    this.router.navigate(['/home']);
  }

  goConfiguracion() {
    this.cerrarRightBox();
    this.router.navigate(['/configuracion']);
  }

  goBack() {
    this.cerrarRightBox();
    this.navCtrl.back();
  }

  backlogout() {
    this.cerrarRightBox();
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
