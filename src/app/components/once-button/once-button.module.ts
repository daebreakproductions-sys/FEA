import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { OnceButtonComponent } from './once-button.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [
        OnceButtonComponent,
    ],
    exports: [
        OnceButtonComponent,
    ]
})
export class OnceButtonModule {}