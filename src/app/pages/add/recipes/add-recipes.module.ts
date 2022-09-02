import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRecipesPageRoutingModule } from './add-recipes-routing.module';

import { AddRecipesPage } from './add-recipes.page';
import { PhotoEditModule } from '@app/components/photo/photo-edit/photo-edit.module';
import { TagAddModule } from '@app/components/tags/tag-add/tag-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddRecipesPageRoutingModule,
    PhotoEditModule,
    TagAddModule,
  ],
  declarations: [AddRecipesPage]
})
export class AddRecipesPageModule {}
