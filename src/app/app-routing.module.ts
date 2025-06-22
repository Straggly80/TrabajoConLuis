import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // tu guard para proteger rutas
import { RedirectGuard } from './guards/redirect.guard'; // guard para la ruta raíz

const routes: Routes = [
  {
    path: '',
    canActivate: [RedirectGuard],  // Decide si ir a home o welcome
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./welcome/welcome.module').then(m => m.WelcomePageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then(m => m.RegisterPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard],  // solo usuarios autenticados
  },
  {
    path: 'favoritos',
    loadChildren: () =>
      import('./favoritos/favoritos.module').then(m => m.FavoritosPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'perfil/:id',
    loadChildren: () =>
      import('./perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'crear',
    loadChildren: () => import('./crear/crear.module').then( m => m.CrearPageModule),
    canActivate: [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
