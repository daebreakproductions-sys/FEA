import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UserHeaderComponent } from './user-header.component';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [
      UserHeaderComponent,
  ],
  exports: [
    UserHeaderComponent,
  ]
})
export class UserHeaderModule { }
