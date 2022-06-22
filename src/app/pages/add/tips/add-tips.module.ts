import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTipsPageRoutingModule } from './add-tips-routing.module';

import { AddTipsPage } from './add-tips.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddTipsPageRoutingModule
  ],
  providers: [
  ],
  declarations: [AddTipsPage]
})
export class AddTipsPageModule {}
