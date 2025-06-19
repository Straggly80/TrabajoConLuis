import { Routes } from '@angular/router';
import { WelcomePage } from './welcome/welcome.page';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { HomePage } from './home/home.page';

export const routes: Routes = [
  { path: '', component: WelcomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'home', component: HomePage },
];
