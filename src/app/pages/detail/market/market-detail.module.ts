import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketDetailPageRoutingModule } from './market-detail-routing.module';

import { MarketDetailPage } from './market-detail.page';
import { FiveStarModule } from '@app/components/reviews/five-star/five-star.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FiveStarModule,
    MarketDetailPageRoutingModule
  ],
  declarations: [MarketDetailPage]
})
export class MarketDetailPageModule {}
