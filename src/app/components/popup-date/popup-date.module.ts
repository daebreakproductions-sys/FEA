import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PopupDateComponent } from './popup-date.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [
        PopupDateComponent,
    ],
    exports: [
        PopupDateComponent,
    ]
})
export class PopupDateModule {}