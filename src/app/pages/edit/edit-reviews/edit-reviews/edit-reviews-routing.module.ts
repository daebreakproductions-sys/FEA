import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditReviewsPage } from './edit-reviews.page';

const routes: Routes = [
  {
    path: ':id',
    component: EditReviewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditReviewsPageRoutingModule {}
