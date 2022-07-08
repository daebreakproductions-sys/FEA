import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodPantrySiteDetailPageRoutingModule } from './foodpantrysite-detail-routing.module';

import { FoodPantrySiteDetailPage } from './foodpantrysite-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodPantrySiteDetailPageRoutingModule
  ],
  declarations: [FoodPantrySiteDetailPage]
})
export class FoodPantrySiteDetailPageModule {}
