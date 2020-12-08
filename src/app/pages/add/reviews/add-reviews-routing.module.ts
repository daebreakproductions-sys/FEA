import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddReviewsPage } from './add-reviews.page';

const routes: Routes = [
  {
    path: '',
    component: AddReviewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddReviewsPageRoutingModule {}
