import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolloweesPageRoutingModule } from './followees-routing.module';

import { FolloweesPage } from './followees.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolloweesPageRoutingModule
  ],
  declarations: [FolloweesPage]
})
export class FolloweesPageModule {}
