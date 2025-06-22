import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth'; // 👈 Importa el servicio de autenticación

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

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth // 👈 Inyecta el servicio de autenticación
  ) {}

  ngOnInit() {
    this.usuarioId = this.route.snapshot.paramMap.get('id');
    console.log('ID del usuario:', this.usuarioId);
  }

  goFavoritos() {
    this.router.navigate(['/favoritos']);
  }

  goBack() {
    this.navCtrl.back();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  backlogout() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
  toggleRightBox() {
    this.showRightBox = !this.showRightBox;
  }
}
