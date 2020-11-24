import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataResolverService } from '@app/resolver/data-resolver.service';

import { DetailPage } from './detail.page';

const routes: Routes = [
  {
    path: ':id',
    // resolve: {
    //   special: DataResolverService
    // },
    component: DetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailPageRoutingModule {}
