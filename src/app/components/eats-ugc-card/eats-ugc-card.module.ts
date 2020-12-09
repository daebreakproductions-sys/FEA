import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EatsUgcCardComponent } from './eats-ugc-card.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [
        EatsUgcCardComponent,
    ],
    exports: [
        EatsUgcCardComponent,
    ]
})
export class EatsUgcComponentModule {}