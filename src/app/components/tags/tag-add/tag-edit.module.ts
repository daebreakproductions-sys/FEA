import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TagAddComponent } from './tag-add.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [
        TagAddComponent,
    ],
    exports: [
        TagAddComponent,
    ]
})
export class TagAddModule {}