import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTipsPage } from './edit-tips.page';

const routes: Routes = [
  {
    path: ':id',
    component: EditTipsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTipsPageRoutingModule {}
