import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TagContentPage } from './tag-content.page';

const routes: Routes = [
  {
    path: ':id',
    component: TagContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagContentPageRoutingModule {}
