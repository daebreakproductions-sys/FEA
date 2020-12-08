import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTipsPage } from './add-tips.page';

const routes: Routes = [
  {
    path: '',
    component: AddTipsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTipsPageRoutingModule {}
