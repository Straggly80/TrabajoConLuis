import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, RouterModule],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }

  /**
   * Determina si un color hex es oscuro o claro, usando la luminosidad
   */
  isColorDark(hexColor: string): boolean {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 186;
  }

  async initializeApp() {
    if (!Capacitor.isNativePlatform()) {
      console.info('Ejecutando en Web: no se configura StatusBar.');
      return;
    }

    try {
      const backgroundColor = '#619def'; // Cambia esto si usas otro color dinámicamente
      const dark = this.isColorDark(backgroundColor);
      const style = dark ? Style.Light : Style.Dark; // Si es oscuro, texto claro. Si es claro, texto oscuro.

      await StatusBar.show();
      await StatusBar.setBackgroundColor({ color: backgroundColor });
      await StatusBar.setStyle({ style });
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (error) {
      console.warn('Error al configurar StatusBar:', error);
    }
  }
}
