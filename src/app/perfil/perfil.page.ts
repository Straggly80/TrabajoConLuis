import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  username: string = '';
  usernameTemp: string = '';
  modoEdicion: boolean = false;
  uid: string | null = null;

  showRightBox = false;
  rightBoxTimer: any;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private authState: AuthStateService
  ) {}

  ngOnInit() {
  this.authState.getUser().subscribe((user) => {
    if (!user) {
      console.warn('Usuario no autenticado');
      this.router.navigate(['/login']);
      return;
    }

    this.uid = user.uid;
    console.log('✅ UID del usuario autenticado:', this.uid);
  });
}


  guardarUsername() {
    this.username = this.usernameTemp;
    this.modoEdicion = false;
    console.log('✅ Username guardado (sin Firestore)');
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
    this.authState.logout().then(() => this.router.navigate(['/login']));
  }
}
