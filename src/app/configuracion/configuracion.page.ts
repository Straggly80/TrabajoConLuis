import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage {
  showRightBox = false;
  rightBoxTimer: any;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private auth: Auth
  ) {}

  toggleRightBox() {
    this.showRightBox = !this.showRightBox;

    if (this.rightBoxTimer) {
      clearTimeout(this.rightBoxTimer);
    }

    if (this.showRightBox) {
      this.rightBoxTimer = setTimeout(() => {
        this.showRightBox = false;
      }, 5000);
    }
  }

  cerrarRightBox() {
    this.showRightBox = false;
    if (this.rightBoxTimer) {
      clearTimeout(this.rightBoxTimer);
    }
  }

  goHome() {
    this.cerrarRightBox();
    this.router.navigate(['/home']);
  }

  goFavoritos() {
    this.cerrarRightBox();
    this.router.navigate(['/favoritos']);
  }

  goPerfil() {
    this.cerrarRightBox();
    this.router.navigate(['/perfil']);
  }

  goCrear() {
    this.cerrarRightBox();
    this.router.navigate(['/crear']);
  }

  goBack() {
    this.cerrarRightBox();
    this.navCtrl.back();
  }

  backlogout() {
    this.auth.signOut().then(() => {
      this.cerrarRightBox();
      this.router.navigate(['/login']);
    });
  }
}
