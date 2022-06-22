import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTipsPageRoutingModule } from './edit-tips-routing.module';

import { EditTipsPage } from './edit-tips.page';
import { TagModalPageModule } from '@app/pages/modals/tag-modal/tag-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditTipsPageRoutingModule,
    TagModalPageModule,
  ],
  providers: [
  ],
  declarations: [EditTipsPage]
})
export class EditTipsPageModule {}
