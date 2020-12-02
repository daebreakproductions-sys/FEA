import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DealsPageRoutingModule } from './deals-routing.module';

import { DealsPage } from './deals.page';
import { MarketModalPageModule } from '@app/pages/modals/market-modal/market-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DealsPageRoutingModule,
    MarketModalPageModule
  ],
  declarations: [DealsPage]
})
export class DealsPageModule {}
