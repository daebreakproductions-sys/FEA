import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDealsPageRoutingModule } from './edit-deals-routing.module';

import { EditDealsPage } from './edit-deals.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditDealsPageRoutingModule
  ],
  declarations: [EditDealsPage]
})
export class EditDealsPageModule {}
