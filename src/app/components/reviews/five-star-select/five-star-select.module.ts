import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FiveStarSelectComponent } from './five-star-select.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [
        FiveStarSelectComponent,
    ],
    exports: [
        FiveStarSelectComponent,
    ]
})
export class FiveStarSelectModule {}