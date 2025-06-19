import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'appmarketplace-716cc',  // Cambia "tuempresa" por tu nombre o dominio invertido
  appName: 'MarketPlace',
  webDir: 'www/browser',                       // Carpeta donde se genera el build de Ionic (usualmente "www")
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#ffffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#999999',
    }
  }
};

export default config;
