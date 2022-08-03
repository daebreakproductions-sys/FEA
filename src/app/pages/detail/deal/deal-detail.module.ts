import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DealDetailPageRoutingModule } from './deal-detail-routing.module';

import { DealDetailPage } from './deal-detail.page';
import { DetailCommentsModule } from '@app/components/comments/detail-comments/detail-comments.module';
import { TagDisplayModule } from '@app/components/tags/tag-display/tag-display.module';
import { UserHeaderModule } from '@app/components/user-header/user-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DealDetailPageRoutingModule,
    DetailCommentsModule,
    TagDisplayModule,
    UserHeaderModule,
  ],
  declarations: [DealDetailPage]
})
export class DealDetailPageModule {}
