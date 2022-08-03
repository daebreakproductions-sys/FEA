import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailCommentsComponent } from './detail-comments.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
    ],
    declarations: [
        DetailCommentsComponent,
    ],
    exports: [
        DetailCommentsComponent,
    ]
})
export class DetailCommentsModule {}