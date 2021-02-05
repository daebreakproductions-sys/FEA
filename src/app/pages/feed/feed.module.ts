import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedPageRoutingModule } from './feed-routing.module';

import { FeedPage } from './feed.page';
import { TagModalPageModule } from '../modals/tag-modal/tag-modal.module';
import { MarketModalPageModule } from '../modals/market-modal/market-modal.module';
import { EatsUgcComponentModule } from '@app/components/eats-ugc-card/eats-ugc-card.module';
import { FilterModalPageModule } from '../modals/filter-modal/filter-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EatsUgcComponentModule,
    FeedPageRoutingModule,
    TagModalPageModule,
    FilterModalPageModule,
    MarketModalPageModule,
  ],
  declarations: [FeedPage]
})
export class FeedPageModule {}
