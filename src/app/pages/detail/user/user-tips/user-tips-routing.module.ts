import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserTipsPage } from './user-tips.page';

const routes: Routes = [
  {
    path: '',
    component: UserTipsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserTipsPageRoutingModule {}
