import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FiveStarDisplayModule } from '../reviews/five-star-display/five-star-display.module';
import { MapPopupComponent } from './map-popup.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FiveStarDisplayModule,
    ],
    declarations: [
        MapPopupComponent,
    ],
    exports: [
        MapPopupComponent,
    ]
})
export class MapPopupModule {}