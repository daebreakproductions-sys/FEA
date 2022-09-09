import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewDetailPageRoutingModule } from './review-detail-routing.module';

import { ReviewDetailPage } from './review-detail.page';
import { UserHeaderModule } from '@app/components/user-header/user-header.module';
import { TagDisplayModule } from '@app/components/tags/tag-display/tag-display.module';
import { DetailCommentsModule } from '@app/components/comments/detail-comments/detail-comments.module';
import { FiveStarDisplayModule } from '@app/components/reviews/five-star-display/five-star-display.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserHeaderModule,
    TagDisplayModule,
    DetailCommentsModule,
    FiveStarDisplayModule,
    ReviewDetailPageRoutingModule
  ],
  declarations: [ReviewDetailPage]
})
export class ReviewDetailPageModule {}
