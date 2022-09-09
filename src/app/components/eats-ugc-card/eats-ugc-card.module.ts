import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FiveStarDisplayModule } from '../reviews/five-star-display/five-star-display.module';
import { EatsUgcCardComponent } from './eats-ugc-card.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FiveStarDisplayModule,
    ],
    declarations: [
        EatsUgcCardComponent,
    ],
    exports: [
        EatsUgcCardComponent,
    ]
})
export class EatsUgcComponentModule {}