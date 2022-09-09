import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketDetailPageRoutingModule } from './market-detail-routing.module';

import { MarketDetailPage } from './market-detail.page';
import { FiveStarDisplayModule } from '@app/components/reviews/five-star-display/five-star-display.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiveStarDisplayModule,
    MarketDetailPageRoutingModule
  ],
  declarations: [MarketDetailPage]
})
export class MarketDetailPageModule {}
