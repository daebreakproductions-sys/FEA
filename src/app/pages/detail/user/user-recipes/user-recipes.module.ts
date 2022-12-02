import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserRecipesPageRoutingModule } from './user-recipes-routing.module';

import { UserRecipesPage } from './user-recipes.page';
import { EatsUgcComponentModule } from '@app/components/eats-ugc-card/eats-ugc-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EatsUgcComponentModule,
    UserRecipesPageRoutingModule
  ],
  declarations: [UserRecipesPage]
})
export class UserRecipesPageModule {}
