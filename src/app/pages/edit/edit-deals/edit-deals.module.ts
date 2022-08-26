import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDealsPageRoutingModule } from './edit-deals-routing.module';

import { EditDealsPage } from './edit-deals.page';
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
    EditDealsPageRoutingModule,
    MarketModalPageModule,
    TagModalPageModule,
    PopupDateModule,
    TagEditModule,
    PhotoEditModule,
  ],
  providers: [
  ],
  declarations: [EditDealsPage]
})
export class EditDealsPageModule {}
