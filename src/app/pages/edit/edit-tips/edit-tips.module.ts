import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTipsPageRoutingModule } from './edit-tips-routing.module';

import { EditTipsPage } from './edit-tips.page';
import { TagModalPageModule } from '@app/pages/modals/tag-modal/tag-modal.module';
import { TagEditModule } from '@app/components/tags/tag-edit/tag-edit.module';
import { PhotoEditModule } from '@app/components/photo/photo-edit/photo-edit.module';
import { OnceButtonModule } from '@app/components/once-button/once-button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TagModalPageModule,
    TagEditModule,
    PhotoEditModule,
    OnceButtonModule,
    EditTipsPageRoutingModule,
  ],
  providers: [
  ],
  declarations: [EditTipsPage]
})
export class EditTipsPageModule {}
