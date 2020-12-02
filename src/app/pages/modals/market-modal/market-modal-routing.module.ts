import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketModalPage } from './market-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MarketModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketModalPageRoutingModule {}
