import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTipsPageRoutingModule } from './edit-tips-routing.module';

import { EditTipsPage } from './edit-tips.page';
import { TagModalPageModule } from '@app/pages/modals/tag-modal/tag-modal.module';
import { TagEditModule } from '@app/components/tags/tag-edit/tag-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditTipsPageRoutingModule,
    TagModalPageModule,
    TagEditModule,
  ],
  providers: [
  ],
  declarations: [EditTipsPage]
})
export class EditTipsPageModule {}
