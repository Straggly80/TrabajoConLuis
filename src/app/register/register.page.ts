import { Component, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, User } from '@angular/fire/auth';
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
  numeroDeTelefono: string = '';
  usuario: string = '';
  email: string = '';
  password: string = '';
  userForVerification: User | null = null;
  showVerificationMessage: boolean = false;
  emailVerified: boolean = false;
  disableResend: boolean = false;

  hasAttemptedRegister: boolean = false;  // <-- Controla si el usuario ya intentó registrarse

  constructor(
    private auth: Auth,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userForVerification = user;
        this.emailVerified = user.emailVerified;
        // No cambiamos showVerificationMessage aquí para evitar que aparezca antes de registrar
      } else {
        this.userForVerification = null;
        this.emailVerified = false;
        this.showVerificationMessage = false;
        this.hasAttemptedRegister = false;  // Resetear también al salir o sin usuario
      }
    });
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
    if (!this.email.includes('@') || !this.email.includes('.')) {
      this.presentToast('Por favor ingresa un correo válido.', 'warning');
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
      this.emailVerified = false;
      this.hasAttemptedRegister = true;  // <-- Aquí activamos que ya se intentó registro

      this.email = '';
      this.password = '';

      this.presentToast('Registro exitoso! Revisa tu correo para verificar la cuenta.', 'success');
    } catch (error: any) {
      this.presentToast('Error: ' + error.message, 'danger');
    }
  }

  async resendVerificationEmail() {
    if (this.userForVerification) {
      this.disableResend = true;
      try {
        await sendEmailVerification(this.userForVerification);
        this.presentToast('Correo de verificación reenviado. Revisa tu bandeja de entrada.', 'success');
      } catch (error: any) {
        if (error.code === 'auth/too-many-requests') {
          this.presentToast('Has solicitado muchos correos de verificación. Intenta más tarde.', 'warning');
        } else {
          this.presentToast('Error al reenviar correo: ' + error.message, 'danger');
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
        this.presentToast('Correo verificado. Ya puedes iniciar sesión.', 'success');
        this.router.navigate(['/login']);
      } else {
        this.presentToast('Tu correo aún no ha sido verificado.', 'warning');
      }
    }
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
  goWelcome() {
    this.router.navigate(['']);
}
};