import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DealsPageRoutingModule } from './add-deals-routing.module';

import { AddDealsPage } from './add-deals.page';
import { MarketModalPageModule } from '@app/pages/modals/market-modal/market-modal.module';
import { PopupDateModule } from '@app/components/popup-date/popup-date.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DealsPageRoutingModule,
    MarketModalPageModule,
    PopupDateModule,
  ],
  providers: [
  ],
  declarations: [AddDealsPage]
})
export class AddDealsPageModule {}
