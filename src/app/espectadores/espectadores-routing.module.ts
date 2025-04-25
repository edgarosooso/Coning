import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EspectadoresPage } from './espectadores.page';

const routes: Routes = [
  {
    path: '',
    component: EspectadoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EspectadoresPageRoutingModule {}
