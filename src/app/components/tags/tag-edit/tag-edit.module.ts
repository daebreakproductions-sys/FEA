import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TagEditComponent } from './tag-edit.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [
        TagEditComponent,
    ],
    exports: [
        TagEditComponent,
    ]
})
export class TagEditModule {}