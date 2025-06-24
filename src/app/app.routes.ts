import { Routes } from '@angular/router';
import { WelcomePage } from './welcome/welcome.page';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { HomePage } from './home/home.page';
import { FavoritosPage } from './favoritos/favoritos.page';
import { PerfilPage } from './perfil/perfil.page';
import { CrearPage } from './crear/crear.page';
import { ConfiguracionPage } from './configuracion/configuracion.page';
// Importamos las páginas que vamos a usar en las rutas

export const routes: Routes = [
  { path: '', component: WelcomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'home', component: HomePage },
  { path: 'favoritos', component: FavoritosPage },
  { path: 'perfil', component: PerfilPage },
  { path: 'crear', component: CrearPage },
  { path: 'configuracion', component: ConfiguracionPage },
  
];
