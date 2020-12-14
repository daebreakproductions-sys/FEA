import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolloweesPage } from './followees.page';

const routes: Routes = [
  {
    path: '',
    component: FolloweesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolloweesPageRoutingModule {}
