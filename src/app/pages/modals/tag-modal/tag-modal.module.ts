import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagModalPageRoutingModule } from './tag-modal-routing.module';

import { TagModalPage } from './tag-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagModalPageRoutingModule
  ],
  declarations: [TagModalPage]
})
export class TagModalPageModule {}
