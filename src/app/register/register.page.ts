import { Component, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RegisterPage implements OnInit {
  email = '';
  password = '';
  showVerificationMessage = false;
  hasAttemptedRegister = false;
  disableResend = false;
  emailVerified = false;
  userForVerification: User | null = null;

  constructor(
    private auth: Auth,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.userForVerification = user;
      this.emailVerified = !!user?.emailVerified;
    });
  }

  isEmail(input: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  async register() {
    if (!this.isEmail(this.email)) {
      this.presentToast('Ingresa un correo válido.', 'warning');
      return;
    }

    if (this.password.length < 6) {
      this.presentToast('La contraseña debe tener al menos 6 caracteres.', 'warning');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      await sendEmailVerification(userCredential.user);

      this.userForVerification = userCredential.user;
      this.showVerificationMessage = true;
      this.hasAttemptedRegister = true;
      this.emailVerified = false;

      // Limpiar inputs
      this.email = '';
      this.password = '';

      this.presentToast('¡Registro exitoso! Revisa tu correo para verificar.', 'success');
    } catch (error: any) {
      this.presentToast('Error: ' + error.message, 'danger');
      console.error('Error en registro:', error);
    }
  }

  async resendVerificationEmail() {
    if (this.userForVerification) {
      this.disableResend = true;
      try {
        await sendEmailVerification(this.userForVerification);
        this.presentToast('Correo reenviado. Revisa tu bandeja.', 'success');
      } catch (error: any) {
        if (error.code === 'auth/too-many-requests') {
          this.presentToast('Demasiados intentos. Espera un momento.', 'warning');
        } else {
          this.presentToast('Error al reenviar: ' + error.message, 'danger');
        }
      } finally {
        setTimeout(() => {
          this.disableResend = false;
        }, 10000);
      }
    }
  }

  async checkVerification() {
    if (this.userForVerification) {
      await this.userForVerification.reload();
      this.emailVerified = this.userForVerification.emailVerified;
      this.showVerificationMessage = !this.emailVerified;

      if (this.emailVerified) {
        this.presentToast('Correo verificado. Puedes iniciar sesión.', 'success');
        this.router.navigate(['/login']);
      } else {
        this.presentToast('Aún no verificas tu correo.', 'warning');
      }
    }
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  goWelcome() {
    this.router.navigate(['']);
  }
}
