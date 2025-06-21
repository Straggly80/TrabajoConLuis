import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoritesService, ProductoFavorito } from '../services/favorites.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  products: ProductoFavorito[] = [
    {
      id: 1,
      name: 'Zapatos Jordan',
      price: '$600',
      img: 'https://ionicframework.com/docs/img/demos/card-media.png',
      descripcion: 'Zapatos nuevos talla 9',
      usuarioId: '' // se sobrescribe al guardar
    },
    {
      id: 2,
      name: 'Camisa Nike',
      price: '$350',
      img: 'https://ionicframework.com/docs/img/demos/card-media.png',
      descripcion: 'Camisa deportiva blanca',
      usuarioId: ''
    }
  ];

  favoritos: ProductoFavorito[] = [];
  favoritosSet = new Set<number>();

  constructor(
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    const user = getAuth().currentUser;
    if (!user) {
      this.favoritos = [];
      this.favoritosSet.clear();
      return;
    }
    this.favoritos = this.favoritesService.getFavoritos(user.uid);
    this.favoritosSet = new Set(this.favoritos.map(p => p.id));
  }

  isFavorito(producto: ProductoFavorito): boolean {
    return this.favoritosSet.has(producto.id);
  }

  toggleFavorito(producto: ProductoFavorito) {
    const user = getAuth().currentUser;
    if (!user) {
      alert('Debes iniciar sesión');
      return;
    }

    if (this.isFavorito(producto)) {
      this.favoritesService.eliminarFavorito(producto.id, user.uid);
    } else {
      const productoConUsuario: ProductoFavorito = {
        ...producto,
        usuarioId: user.uid
      };
      this.favoritesService.agregarFavorito(productoConUsuario);
    }
    this.cargarFavoritos();
  }

  goFavoritos() {
    this.router.navigate(['/favoritos']);
  }

  goPerfil() {
    this.router.navigate(['/perfil']);
  }
}
// Este componente representa la página principal de la aplicación.
// Muestra una lista de productos y permite agregar o eliminar favoritos.