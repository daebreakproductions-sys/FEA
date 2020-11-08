import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PrimaryPageRoutingModule } from './primary-routing.module';

import { PrimaryPage } from './primary.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PrimaryPageRoutingModule
  ],
  declarations: [PrimaryPage]
})
export class PrimaryPageModule {}
