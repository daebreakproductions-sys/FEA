import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TagDisplayComponent } from './tag-display.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [
        TagDisplayComponent,
    ],
    exports: [
        TagDisplayComponent,
    ]
})
export class TagDisplayModule {}