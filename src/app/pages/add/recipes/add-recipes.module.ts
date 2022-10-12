import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRecipesPageRoutingModule } from './add-recipes-routing.module';

import { AddRecipesPage } from './add-recipes.page';
import { PhotoEditModule } from '@app/components/photo/photo-edit/photo-edit.module';
import { TagAddModule } from '@app/components/tags/tag-add/tag-edit.module';
import { OnceButtonModule } from '@app/components/once-button/once-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PhotoEditModule,
    TagAddModule,
    OnceButtonModule,
    AddRecipesPageRoutingModule,
  ],
  declarations: [AddRecipesPage]
})
export class AddRecipesPageModule {}
