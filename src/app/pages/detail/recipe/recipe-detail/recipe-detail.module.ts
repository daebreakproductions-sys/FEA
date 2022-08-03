import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeDetailPageRoutingModule } from './recipe-detail-routing.module';

import { RecipeDetailPage } from './recipe-detail.page';
import { TagDisplayModule } from '@app/components/tags/tag-display/tag-display.module';
import { DetailCommentsModule } from '@app/components/comments/detail-comments/detail-comments.module';
import { UserHeaderModule } from '@app/components/user-header/user-header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeDetailPageRoutingModule,
    TagDisplayModule,
    DetailCommentsModule,
    UserHeaderModule,
  ],
  declarations: [RecipeDetailPage]
})
export class RecipeDetailPageModule {}
