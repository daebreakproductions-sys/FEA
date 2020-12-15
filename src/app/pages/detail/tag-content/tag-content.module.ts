import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagContentPageRoutingModule } from './tag-content-routing.module';

import { TagContentPage } from './tag-content.page';
import { EatsUgcComponentModule } from '@app/components/eats-ugc-card/eats-ugc-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EatsUgcComponentModule,
    TagContentPageRoutingModule
  ],
  declarations: [TagContentPage]
})
export class TagContentPageModule {}
