import { Injectable } from '@angular/core';

export interface ProductoFavorito {
  id: number;
  name: string;
  price: string;
  img: string;
  descripcion: string;
  usuarioId: string; // obligatorio para identificar usuario
  lat?: number;   // <-- Agrega estas dos
  lng?: number;
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private STORAGE_KEY = 'favoritos';

  agregarFavorito(producto: ProductoFavorito) {
    const favoritos = this.getFavoritos(producto.usuarioId);
    const existe = favoritos.find(p => p.id === producto.id);
    if (!existe) {
      favoritos.push(producto);
      // Guardar TODOS los favoritos (de todos los usuarios) en localStorage:
      this.guardarTodosFavoritos(favoritos, producto.usuarioId);
    }
  }

  getFavoritos(uid: string): ProductoFavorito[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const favoritos: ProductoFavorito[] = data ? JSON.parse(data) : [];
    // Filtrar solo los del usuario solicitado
    return favoritos.filter(p => p.usuarioId === uid);
  }

  eliminarFavorito(id: number, uid: string) {
    const data = localStorage.getItem(this.STORAGE_KEY);
    let favoritos: ProductoFavorito[] = data ? JSON.parse(data) : [];
    favoritos = favoritos.filter(p => !(p.id === id && p.usuarioId === uid));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favoritos));
  }

  limpiarFavoritosDeUsuario(uid: string) {
    const data = localStorage.getItem(this.STORAGE_KEY);
    let favoritos: ProductoFavorito[] = data ? JSON.parse(data) : [];
    favoritos = favoritos.filter(p => p.usuarioId !== uid);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favoritos));
  }

  private guardarTodosFavoritos(favoritosUsuario: ProductoFavorito[], uid: string) {
    // Obtener todos los favoritos guardados
    const data = localStorage.getItem(this.STORAGE_KEY);
    let todosFavoritos: ProductoFavorito[] = data ? JSON.parse(data) : [];

    // Filtrar fuera los favoritos del usuario actual para reemplazarlos
    todosFavoritos = todosFavoritos.filter(p => p.usuarioId !== uid);

    // Agregar los favoritos actualizados del usuario
    todosFavoritos = todosFavoritos.concat(favoritosUsuario);

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todosFavoritos));
  }
}
// Este servicio maneja los favoritos de productos.
// Permite agregar, obtener, eliminar y limpiar favoritos por usuario.