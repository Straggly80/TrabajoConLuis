import { Component, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  User,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  Timestamp
} from '@angular/fire/firestore'; // AÑADIDO Timestamp
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
  usuario = '';
  emailOrPhone = '';
  password = '';
  showVerificationMessage = false;
  hasAttemptedRegister = false;
  disableResend = false;
  emailVerified = false;
  userForVerification: User | null = null;

  recaptchaVerifier!: RecaptchaVerifier;
  confirmationResult: any;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.userForVerification = user;
      this.emailVerified = !!user?.emailVerified;
    });

    this.recaptchaVerifier = new RecaptchaVerifier(
      this.auth,
      'recaptcha-container',
      {
        size: 'invisible'
      }
    );
  }

  isEmail(input: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  }

  isPhone(input: string): boolean {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(input);
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
    if (!this.isEmail(this.emailOrPhone) && !this.isPhone(this.emailOrPhone)) {
      this.presentToast('Ingresa un correo válido o número de teléfono.', 'warning');
      return;
    }

    if (!this.usuario || this.usuario.trim() === '') {
      this.presentToast('El campo "usuario" es obligatorio.', 'warning');
      return;
    }

    if (this.isEmail(this.emailOrPhone)) {
      // REGISTRO CON CORREO
      if (this.password.length < 6) {
        this.presentToast('La contraseña debe tener al menos 6 caracteres.', 'warning');
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, this.emailOrPhone, this.password);
        await sendEmailVerification(userCredential.user);

        await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          usuario: this.usuario,
          createdAt: Timestamp.now() // CORREGIDO
        });

        this.userForVerification = userCredential.user;
        this.showVerificationMessage = true;
        this.hasAttemptedRegister = true;
        this.emailVerified = false;

        this.emailOrPhone = '';
        this.password = '';

        this.presentToast('¡Registro exitoso! Revisa tu correo para verificar.', 'success');
      } catch (error: any) {
        this.presentToast('Error: ' + error.message, 'danger');
        console.error('Error en registro por correo:', error);
      }
    } else {
      // REGISTRO CON TELÉFONO
      try {
        this.confirmationResult = await signInWithPhoneNumber(this.auth, this.emailOrPhone, this.recaptchaVerifier);
        const code = prompt('Ingresa el código que recibiste por SMS:');
        if (code) {
          const result = await this.confirmationResult.confirm(code);
          const user = result.user;

          await setDoc(doc(this.firestore, 'users', user.uid), {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
            usuario: this.usuario,
            createdAt: Timestamp.now() // CORREGIDO
          });

          this.presentToast('¡Número verificado y registro exitoso!', 'success');
          this.router.navigate(['/login']);
        }
      } catch (error: any) {
        this.presentToast('Error con número de teléfono: ' + error.message, 'danger');
        console.error('Error en registro con teléfono:', error);
      }
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
