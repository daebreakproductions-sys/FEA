import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipsPageRoutingModule } from './tips-routing.module';

import { TipsPage } from './tips.page';
import { EatsUgcComponentModule } from '@app/components/eats-ugc-card/eats-ugc-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EatsUgcComponentModule,
    TipsPageRoutingModule,
  ],
  declarations: [TipsPage]
})
export class TipsPageModule {}
