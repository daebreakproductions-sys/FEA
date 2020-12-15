import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipDetailPage } from './tip-detail.page';

const routes: Routes = [
  {
    path: ':id',
    component: TipDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipDetailPageRoutingModule {}
