import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MePageRoutingModule } from './me-routing.module';

import { MePage } from './me.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MePageRoutingModule,
    RouterModule.forChild([{ path: '', component: MePage }])
  ],
  declarations: [MePage]
})
export class MePageModule {}
