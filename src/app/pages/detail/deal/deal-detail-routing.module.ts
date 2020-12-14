import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DealDetailPage } from './deal-detail.page';

const routes: Routes = [
  {
    path: ':id',
    component: DealDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealDetailPageRoutingModule {}
