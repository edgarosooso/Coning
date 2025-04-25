import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EspectadoresPageRoutingModule } from './espectadores-routing.module';

import { EspectadoresPage } from './espectadores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EspectadoresPageRoutingModule
  ],
  declarations: [EspectadoresPage]
})
export class EspectadoresPageModule {}
