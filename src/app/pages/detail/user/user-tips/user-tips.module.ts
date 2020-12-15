import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserTipsPageRoutingModule } from './user-tips-routing.module';

import { UserTipsPage } from './user-tips.page';
import { EatsUgcComponentModule } from '@app/components/eats-ugc-card/eats-ugc-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EatsUgcComponentModule,
    UserTipsPageRoutingModule
  ],
  declarations: [UserTipsPage]
})
export class UserTipsPageModule {}
