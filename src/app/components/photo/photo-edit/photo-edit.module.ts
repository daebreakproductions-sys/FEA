import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PhotoEditComponent } from './photo-edit.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [
        PhotoEditComponent,
    ],
    exports: [
        PhotoEditComponent,
    ]
})
export class PhotoEditModule {}