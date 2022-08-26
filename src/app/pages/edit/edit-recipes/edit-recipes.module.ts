import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRecipesPageRoutingModule } from './edit-recipes-routing.module';

import { EditRecipesPage } from './edit-recipes.page';
import { MarketModalPageModule } from '@app/pages/modals/market-modal/market-modal.module';
import { TagModalPageModule } from '@app/pages/modals/tag-modal/tag-modal.module';
import { PopupDateModule } from '@app/components/popup-date/popup-date.module';
import { TagEditModule } from '@app/components/tags/tag-edit/tag-edit.module';
import { PhotoEditModule } from '@app/components/photo/photo-edit/photo-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditRecipesPageRoutingModule,
    MarketModalPageModule,
    TagModalPageModule,
    PopupDateModule,
    TagEditModule,
    PhotoEditModule,
  ],
  providers: [
  ],
  declarations: [EditRecipesPage]
})
export class EditRecipesPageModule {}
