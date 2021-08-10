import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DealsPageRoutingModule } from './add-deals-routing.module';

import { AddDealsPage } from './add-deals.page';
import { MarketModalPageModule } from '@app/pages/modals/market-modal/market-modal.module';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DealsPageRoutingModule,
    MarketModalPageModule
  ],
  providers: [
    Camera,
    File,
  ],
  declarations: [AddDealsPage]
})
export class AddDealsPageModule {}
