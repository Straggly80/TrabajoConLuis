import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FavoritesService, ProductoFavorito } from '../services/favorites.service';
import { Auth } from '@angular/fire/auth';

declare const google: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
showRightBox = false;
  // Datos de ejemplo para productos

  products: ProductoFavorito[] = [
    {
      id: 1,
      name: 'Zapatos Jordan',
      price: '$600',
      img: 'https://ionicframework.com/docs/img/demos/card-media.png',
      descripcion: 'Zapatos nuevos talla 9',
      usuarioId: '',
      lat: 19.4326,
      lng: -99.1332
    },
    {
      id: 2,
      name: 'Camisa Nike',
      price: '$350',
      img: 'https://ionicframework.com/docs/img/demos/card-media.png',
      descripcion: 'Camisa deportiva blanca',
      usuarioId: '',
      lat: 19.4340,
      lng: -99.1350
    }
  ];

  favoritos: ProductoFavorito[] = [];
  favoritosSet = new Set<number>();

  constructor(
    private router: Router,
    private favoritesService: FavoritesService,
    private auth: Auth
  ) {}

  toggleRightBox() {
    this.showRightBox = !this.showRightBox;
  }

  ngOnInit() {
    this.cargarFavoritos();
  }

  ngAfterViewInit() {
    this.loadGoogleMaps().then(() => this.initMap());
  }

  async cargarFavoritos() {
    const user = await this.auth.currentUser;
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

  async toggleFavorito(producto: ProductoFavorito) {
    const user = await this.auth.currentUser;
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

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).google && (window as any).google.maps) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if ((window as any).google && (window as any).google.maps) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });
  }

  initMap() {
    if (!this.products.length) return;

    const center = new google.maps.LatLng(this.products[0].lat, this.products[0].lng);
    const mapDiv = document.getElementById('map');

    const map = new google.maps.Map(mapDiv, {
      center,
      zoom: 10,
      disableDefaultUI: true,
      clickableIcons: false,
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.park',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.attraction',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.business',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.place_of_worship',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.school',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi.medical',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'all',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ visibility: 'simplified' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'administrative',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]

   });

    this.products.forEach(producto => {
      new google.maps.Marker({
        position: { lat: producto.lat, lng: producto.lng },
        map,
        title: producto.name,
      });
    });

    // 🔧 Solución al "mapa se mueve de lugar":
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter(center);
    }, 500);
  }


  goToProduct(producto: ProductoFavorito) {
    this.router.navigate(['/product', producto.id]);
  }

  goFavoritos() {
    this.router.navigate(['/favoritos']);
  }

  goPerfil() {
    this.router.navigate(['/perfil']);
  }

  goCrear() {
    this.router.navigate(['/crear']);
  }

}
