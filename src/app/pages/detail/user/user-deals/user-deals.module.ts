import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserDealsPageRoutingModule } from './user-deals-routing.module';

import { UserDealsPage } from './user-deals.page';
import { EatsUgcComponentModule } from '@app/components/eats-ugc-card/eats-ugc-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EatsUgcComponentModule,
    UserDealsPageRoutingModule
  ],
  declarations: [UserDealsPage]
})
export class UserDealsPageModule {}
