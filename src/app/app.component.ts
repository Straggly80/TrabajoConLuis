import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

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

  async initializeApp() {
    if (!Capacitor.isNativePlatform()) {
      console.info('Ejecutando en Web: no se configura StatusBar.');
      return;
    }

    try {
      await StatusBar.show();
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (error) {
      console.warn('Error al configurar StatusBar:', error);
    }
  }
}
