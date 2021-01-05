import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NearbyPage } from './nearby.page';
import { Geolocation } from '@ionic-native/geolocation/ngx/index';
import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: NearbyPage }])
  ],
  declarations: [NearbyPage],
  providers: [Geolocation]
})
export class NearbyPageModule {}
