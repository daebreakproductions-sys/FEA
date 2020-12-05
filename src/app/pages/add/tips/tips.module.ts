import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipsPageRoutingModule } from './tips-routing.module';

import { TipsPage } from './tips.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TipsPageRoutingModule
  ],
  declarations: [TipsPage]
})
export class TipsPageModule {}
