import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FiveStarDisplayComponent } from './five-star-display.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [
        FiveStarDisplayComponent,
    ],
    exports: [
        FiveStarDisplayComponent,
    ]
})
export class FiveStarDisplayModule {}