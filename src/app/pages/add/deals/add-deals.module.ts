import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DealsPageRoutingModule } from './add-deals-routing.module';

import { AddDealsPage } from './add-deals.page';
import { MarketModalPageModule } from '@app/pages/modals/market-modal/market-modal.module';
import { PopupDateModule } from '@app/components/popup-date/popup-date.module';
import { OnceButtonModule } from '@app/components/once-button/once-button.module';
import { TagAddModule } from '@app/components/tags/tag-add/tag-edit.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PopupDateModule,
    OnceButtonModule,
    TagAddModule,
    DealsPageRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  providers: [
  ],
  declarations: [AddDealsPage]
})
export class AddDealsPageModule {}
