import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NearbyPage } from './nearby.page';
import { IonicModule } from '@ionic/angular';
import { MapPopupModule } from '@app/components/map-popup/map-popup.module';
import { FiveStarDisplayModule } from "../../components/reviews/five-star-display/five-star-display.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPopupModule,
    FiveStarDisplayModule,
    RouterModule.forChild([{ path: '', component: NearbyPage }])
],
  declarations: [NearbyPage],
})
export class NearbyPageModule {}
