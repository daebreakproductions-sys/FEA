import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTipsPageRoutingModule } from './add-tips-routing.module';

import { AddTipsPage } from './add-tips.page';
import { OnceButtonModule } from '@app/components/once-button/once-button.module';
import { TagAddModule } from '@app/components/tags/tag-add/tag-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    OnceButtonModule,
    TagAddModule,
    AddTipsPageRoutingModule
  ],
  providers: [
  ],
  declarations: [AddTipsPage]
})
export class AddTipsPageModule {}
