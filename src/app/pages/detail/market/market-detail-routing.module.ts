import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataResolverService } from '@app/resolver/data-resolver.service';

import { MarketDetailPage } from './market-detail.page';

const routes: Routes = [
  {
    path: ':id',
    component: MarketDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketDetailPageRoutingModule {}
