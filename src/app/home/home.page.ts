import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FavoritesService, ProductoFavorito } from '../services/favorites.service';
import { Auth } from '@angular/fire/auth';
import { filter } from 'rxjs/operators';

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
  rightBoxTimer: any;

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
    // Invertir estado
    this.showRightBox = !this.showRightBox;

  }

  cerrarRightBox() {
    this.showRightBox = false;
    clearTimeout(this.rightBoxTimer);
  }

  ngOnInit() {
    // Detectar navegación hacia esta página (opcional, para limpieza)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/home') {
        this.showRightBox = false;
        clearTimeout(this.rightBoxTimer);
        this.cargarFavoritos();
      }
    });
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

  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.warn('Geolocation failed:', error.message);
            resolve({ lat: 19.4326, lng: -99.1332 }); // CDMX por defecto
          }
        );
      } else {
        console.warn('Geolocation is not supported by this browser.');
        resolve({ lat: 20.4326, lng: -59.1332 });
      }
    });
  }

  async initMap() {
    const userLocation = await this.getCurrentLocation();
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    const map = new google.maps.Map(mapDiv, {
      center: userLocation,
      zoom: 14,
      disableDefaultUI: true,
      clickableIcons: false,
      mapTypeId: 'roadmap',
      styles: [
        { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'on' }] },
        { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'on' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ visibility: 'on' }] },
        { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'on'}] },
        { featureType: 'administrative', elementType: 'labels', stylers: [{ visibility: 'on' }] },
        { featureType: 'water', elementType: 'labels', stylers: [{ visibility: 'on' }] }
      ]
    });

    // Marca tu ubicación actual
    new google.maps.Marker({
      position: userLocation,
      map,
      title: 'Tu ubicación',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#ffffff'
      }
    });

    // Marcadores de productos
    this.products.forEach(producto => {
      new google.maps.Marker({
        position: { lat: producto.lat, lng: producto.lng },
        map,
        title: producto.name,
      });
    });

    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter(userLocation);
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
