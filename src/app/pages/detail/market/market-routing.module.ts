import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataResolverService } from '@app/resolver/data-resolver.service';

import { MarketPage } from './market.page';

const routes: Routes = [
  {
    path: ':id',
    component: MarketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketPageRoutingModule {}
