import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TagModalPage } from './tag-modal.page';

const routes: Routes = [
  {
    path: '',
    component: TagModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagModalPageRoutingModule {}
