import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuarioId: string | null = null;
  showRightBox = false;
  rightBoxTimer: any;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.usuarioId = this.route.snapshot.paramMap.get('id');
    console.log('ID del usuario:', this.usuarioId);

    // Detectar si regresamos a esta vista
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/perfil') {
        this.showRightBox = false;
        clearTimeout(this.rightBoxTimer);
      }
    });
  }

  toggleRightBox() {
    this.showRightBox = !this.showRightBox;

    // Limpiar temporizador anterior
    if (this.rightBoxTimer) {
      clearTimeout(this.rightBoxTimer);
    }

    // Si se abre, iniciar temporizador
    if (this.showRightBox) {
      this.rightBoxTimer = setTimeout(() => {
        this.showRightBox = false;
      }, 5000);
    }
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
