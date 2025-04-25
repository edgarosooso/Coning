import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JuegoTerminadoPage } from './juego-terminado.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoTerminadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegoTerminadoPageRoutingModule {}
