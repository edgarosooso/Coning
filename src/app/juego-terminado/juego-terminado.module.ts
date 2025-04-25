import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JuegoTerminadoPageRoutingModule } from './juego-terminado-routing.module';

import { JuegoTerminadoPage } from './juego-terminado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JuegoTerminadoPageRoutingModule
  ],
  declarations: [JuegoTerminadoPage]
})
export class JuegoTerminadoPageModule {}
