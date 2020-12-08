import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddReviewsPageRoutingModule } from './add-reviews-routing.module';

import { AddReviewsPage } from './add-reviews.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddReviewsPageRoutingModule
  ],
  declarations: [AddReviewsPage]
})
export class AddReviewsPageModule {}
