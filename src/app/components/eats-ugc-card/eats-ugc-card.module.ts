import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FiveStarModule } from '../reviews/five-star/five-star.module';
import { EatsUgcCardComponent } from './eats-ugc-card.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FiveStarModule,
    ],
    declarations: [
        EatsUgcCardComponent,
    ],
    exports: [
        EatsUgcCardComponent,
    ]
})
export class EatsUgcComponentModule {}