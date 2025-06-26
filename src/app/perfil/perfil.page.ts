import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NavController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Firestore, doc, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../services/auth-state.service'; // Asegúrate de importar esto

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
    private firestore: Firestore,
    private authState: AuthStateService
  ) {}

  async ngOnInit() {
    const user = this.authState.getCurrentUser();
    if (!user) {
      console.warn('Usuario no autenticado');
      this.router.navigate(['/login']);
      return;
    }

    this.uid = user.uid;
    const ref = doc(this.firestore, 'users', this.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      this.username = snap.data()['username'] || '';
      this.usernameTemp = this.username;
    } else {
      await setDoc(ref, {
        uid: this.uid,
        email: user.email || '',
        username: '',
        createdAt: Timestamp.now()
      });
      console.log('✅ Documento creado en Firestore para:', this.uid);
      this.username = '';
      this.usernameTemp = '';
    }

    // Escucha navegación para efectos visuales (opcional)
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe();
  }

  async guardarUsername() {
    if (!this.uid) return;
    try {
      const ref = doc(this.firestore, 'users', this.uid);
      await setDoc(ref, { username: this.usernameTemp }, { merge: true });
      this.username = this.usernameTemp;
      this.modoEdicion = false;
      console.log('✅ Username guardado');
    } catch (error) {
      console.error('Error al guardar username:', error);
    }
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.usernameTemp = this.username;
  }

  toggleRightBox() { this.showRightBox = !this.showRightBox; }
  cerrarRightBox() { this.showRightBox = false; clearTimeout(this.rightBoxTimer); }
  goFavoritos() { this.cerrarRightBox(); this.router.navigate(['/favoritos']); }
  goHome() { this.cerrarRightBox(); this.router.navigate(['/home']); }
  goConfiguracion() { this.cerrarRightBox(); this.router.navigate(['/configuracion']); }
  goBack() { this.cerrarRightBox(); this.navCtrl.back(); }
  backlogout() {
    this.cerrarRightBox();
    this.authState.logout().then(() => this.router.navigate(['/login']));
  }
}
