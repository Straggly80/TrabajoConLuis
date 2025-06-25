import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { IonicModule } from '@ionic/angular';
import { environment } from './environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';


// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

// Animaciones Angular
import { provideAnimations } from '@angular/platform-browser/animations';

// 💡 Capacitor StatusBar
import { StatusBar, Style } from '@capacitor/status-bar';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      IonicModule.forRoot()
    ),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), // <--- Aquí el proveedor de Firestore
    provideAnimations()
  ]
}).then(() => {
  // 💡 Aquí configuramos la StatusBar cuando la app arranca
  StatusBar.setOverlaysWebView({ overlay: true }); // Deja pasar la imagen por detrás
  StatusBar.setBackgroundColor({ color: 'white' }); // Fondo transparente
  StatusBar.setStyle({ style: Style.Light }); // Letras blancas
});
