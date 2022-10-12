import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddReviewsPageRoutingModule } from './add-reviews-routing.module';

import { AddReviewsPage } from './add-reviews.page';
import { TagAddModule } from '@app/components/tags/tag-add/tag-edit.module';
import { FiveStarSelectModule } from '@app/components/reviews/five-star-select/five-star-select.module';
import { OnceButtonModule } from '@app/components/once-button/once-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TagAddModule,
    FiveStarSelectModule,
    OnceButtonModule,
    AddReviewsPageRoutingModule
  ],
  declarations: [AddReviewsPage]
})
export class AddReviewsPageModule {}
