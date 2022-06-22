import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketModalPageRoutingModule } from './market-modal-routing.module';

import { MarketModalPage } from './market-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketModalPageRoutingModule
  ],
  declarations: [MarketModalPage],
})
export class MarketModalPageModule {}
