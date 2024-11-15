import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FiveStarDisplayModule } from '../reviews/five-star-display/five-star-display.module';
import { EatsPgUgcCardComponent } from './eats-pg-ugc-card.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FiveStarDisplayModule,
    ],
    declarations: [
        EatsPgUgcCardComponent,
    ],
    exports: [
        EatsPgUgcCardComponent,
    ]
})
export class EatsPgUgcComponentModule {}