import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JugadoresEnSalaPage } from './jugadores-en-sala.page';

const routes: Routes = [
  {
    path: '',
    component: JugadoresEnSalaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JugadoresEnSalaPageRoutingModule {}
