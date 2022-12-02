import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserReviewsPageRoutingModule } from './user-reviews-routing.module';

import { UserReviewsPage } from './user-reviews.page';
import { EatsUgcComponentModule } from '@app/components/eats-ugc-card/eats-ugc-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EatsUgcComponentModule,
    UserReviewsPageRoutingModule
  ],
  declarations: [UserReviewsPage]
})
export class UserReviewsPageModule {}
