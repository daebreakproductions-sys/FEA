import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FiveStarComponent } from './five-star.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [
        FiveStarComponent,
    ],
    exports: [
        FiveStarComponent,
    ]
})
export class FiveStarModule {}