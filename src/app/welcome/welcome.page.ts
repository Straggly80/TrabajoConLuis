import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class WelcomePage {

  constructor(private router: Router) {}

  goLogin() {
    this.router.navigate(['/login']);
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  // 🔵 Funciones para los íconos de redes sociales:
  loginWithFacebook() {
    console.log('Iniciar sesión con Facebook (pendiente)');
  }

  loginWithGoogle() {
    console.log('Iniciar sesión con Google (pendiente)');
  }

  loginWithApple() {
    console.log('Iniciar sesión con Apple (pendiente)');
  }

  loginWithGithub() {
    console.log('Iniciar sesión con GitHub (pendiente)');
  }

}
