import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRecipesPageRoutingModule } from './add-recipes-routing.module';

import { AddRecipesPage } from './add-recipes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddRecipesPageRoutingModule
  ],
  declarations: [AddRecipesPage]
})
export class AddRecipesPageModule {}
