import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPage } from './add.page';

const routes: Routes = [
  {
    path: '',
    component: AddPage
  },
  {
    path: 'recipes',
    loadChildren: () => import('./recipes/add-recipes.module').then( m => m.AddRecipesPageModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/add-reviews.module').then( m => m.AddReviewsPageModule)
  },
  {
    path: 'deals',
    loadChildren: () => import('./deals/add-deals.module').then( m => m.AddDealsPageModule)
  },
  {
    path: 'tips',
    loadChildren: () => import('./tips/add-tips.module').then( m => m.AddTipsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPageRoutingModule {}
