import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditReviewsPageRoutingModule } from './edit-reviews-routing.module';

import { EditReviewsPage } from './edit-reviews.page';
import { TagEditModule } from '@app/components/tags/tag-edit/tag-edit.module';
import { FiveStarSelectModule } from '@app/components/reviews/five-star-select/five-star-select.module';
import { MarketModalPageModule } from '@app/pages/modals/market-modal/market-modal.module';
import { TagModalPageModule } from '@app/pages/modals/tag-modal/tag-modal.module';
import { OnceButtonModule } from '@app/components/once-button/once-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagEditModule,
    FiveStarSelectModule,
    MarketModalPageModule,
    TagModalPageModule,
    ReactiveFormsModule,
    OnceButtonModule,
    EditReviewsPageRoutingModule
  ],
  declarations: [EditReviewsPage]
})
export class EditReviewsPageModule {}
