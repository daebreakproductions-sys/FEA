import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDealsPage } from './user-deals.page';

const routes: Routes = [
  {
    path: '',
    component: UserDealsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDealsPageRoutingModule {}
