import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router'; // 👈 Necesario para leer parámetros
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';




@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuarioId: string | null = null;

  constructor(
  private navCtrl: NavController,
  private route: ActivatedRoute,
  private router: Router
) {}


  ngOnInit() {
    // Leer el parámetro :id de la URL
    this.usuarioId = this.route.snapshot.paramMap.get('id');

    // Puedes mostrarlo por consola para probar
    console.log('ID del usuario:', this.usuarioId);

    // Aquí puedes luego cargar datos del usuario usando su ID
    // Ejemplo:
    // this.cargarProductosDeUsuario(this.usuarioId);
  }

  goFavoritos() {
    this.router.navigate(['/favoritos']);
  }

  goPerfil() {
    this.router.navigate(['/perfil']);
  }

  goBack() {
  this.navCtrl.back();
}
}
