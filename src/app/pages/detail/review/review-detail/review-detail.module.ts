import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewDetailPageRoutingModule } from './review-detail-routing.module';

import { ReviewDetailPage } from './review-detail.page';
import { UserHeaderModule } from '@app/components/user-header/user-header.module';
import { TagDisplayModule } from '@app/components/tags/tag-display/tag-display.module';
import { DetailCommentsModule } from '@app/components/comments/detail-comments/detail-comments.module';
import { FiveStarModule } from '@app/components/reviews/five-star/five-star.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserHeaderModule,
    TagDisplayModule,
    DetailCommentsModule,
    FiveStarModule,
    ReviewDetailPageRoutingModule
  ],
  declarations: [ReviewDetailPage]
})
export class ReviewDetailPageModule {}
