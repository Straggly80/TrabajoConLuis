import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword, onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private auth: Auth, private router: Router) {
    onAuthStateChanged(this.auth, (user) => {
      if (user && user.emailVerified) {
        this.router.navigate(['/home']);
      }
    });
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  goWelcome() {
    this.router.navigate(['']);
  }

  async login() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.email || !emailRegex.test(this.email)) {
      return;
    }

    if (!this.password || this.password.length < 6) {
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.email, this.password);
      if (!userCredential.user.emailVerified) {
        return;
      }
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.log('Error:', error.code);
      // Puedes mostrar errores con un toast si quieres, o dejarlo así
    }
  }
}
