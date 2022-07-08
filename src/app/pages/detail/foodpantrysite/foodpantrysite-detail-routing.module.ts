import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodPantrySiteDetailPage } from './foodpantrysite-detail.page';

const routes: Routes = [
  {
    path: ':id',
    component: FoodPantrySiteDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodPantrySiteDetailPageRoutingModule {}
