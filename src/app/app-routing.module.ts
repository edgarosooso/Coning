import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard'; // Importa con el nombre en minúscula

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'jugador-contra-ia',
    loadChildren: () =>
      import('./jugador-contra-ia/jugador-contra-ia.module').then(
        (m) => m.JugadorContraIaPageModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'juego-terminado',
    loadChildren: () =>
      import('./juego-terminado/juego-terminado.module').then(
        (m) => m.JuegoTerminadoPageModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'espectadores',
    loadChildren: () =>
      import('./espectadores/espectadores.module').then(
        (m) => m.EspectadoresPageModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'jugadores-en-sala',
    loadChildren: () =>
      import('./jugadores-en-sala/jugadores-en-sala.module').then(
        (m) => m.JugadoresEnSalaPageModule
      ),
    canActivate: [authGuard], // Protege esta ruta
  },
  {
    path: 'sala-espera',
    loadChildren: () =>
      import('./sala-espera/sala-espera.module').then(
        (m) => m.SalaEsperaPageModule
      ),
    canActivate: [authGuard], // Protege esta ruta
  },
  {
    path: 'jugador-contra-jugador',
    loadChildren: () =>
      import('./jugador-contra-jugador/jugador-contra-jugador.module').then(
        (m) => m.JugadorContraJugadorPageModule
      ),
    canActivate: [authGuard], // Protege esta ruta
  },
  {
    path: 'ranking',
    loadChildren: () =>
      import('./ranking/ranking.module').then((m) => m.RankingPageModule),
    canActivate: [authGuard], // Protege esta ruta
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
