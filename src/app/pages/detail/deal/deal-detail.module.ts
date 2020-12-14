import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DealDetailPageRoutingModule } from './deal-detail-routing.module';

import { DealDetailPage } from './deal-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DealDetailPageRoutingModule
  ],
  declarations: [DealDetailPage]
})
export class DealDetailPageModule {}
