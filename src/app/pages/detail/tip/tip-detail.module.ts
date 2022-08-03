import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipDetailPageRoutingModule } from './tip-detail-routing.module';

import { TipDetailPage } from './tip-detail.page';
import { TagDisplayModule } from '@app/components/tags/tag-display/tag-display.module';
import { DetailCommentsModule } from '@app/components/comments/detail-comments/detail-comments.module';
import { UserHeaderModule } from '@app/components/user-header/user-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TipDetailPageRoutingModule,
    TagDisplayModule,
    DetailCommentsModule,
    UserHeaderModule,
  ],
  declarations: [TipDetailPage]
})
export class TipDetailPageModule {}
