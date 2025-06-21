import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FavoritesService, ProductoFavorito } from '../services/favorites.service';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {
  favoritos: ProductoFavorito[] = [];

  constructor(
    private navCtrl: NavController,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    const user = getAuth().currentUser;
    if (user) {
      this.favoritos = this.favoritesService.getFavoritos(user.uid);
    }
  }

  irAlPerfil(usuarioId: string) {
    this.router.navigate(['/perfil', usuarioId]);
  }

  eliminar(producto: ProductoFavorito) {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return;
    this.favoritesService.eliminarFavorito(producto.id, uid);
    this.cargarFavoritos();
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
//   if (!user) return;
//     producto.usuarioId = user.uid; // Asignar el ID del usuario al producto