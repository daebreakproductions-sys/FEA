import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PrimaryPageRoutingModule } from './primary-routing.module';

import { PrimaryPage } from './primary.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimaryPageRoutingModule
  ],
  declarations: [PrimaryPage]
})
export class PrimaryPageModule {}
