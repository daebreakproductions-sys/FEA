import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MePage } from './me.page';

const routes: Routes = [
  {
    path: '',
    component: MePage,
    children: [
      {
        path: 'recipes',
        loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesPageModule)
      },
      {
        path: 'tips',
        loadChildren: () => import('./tips/tips.module').then(m => m.TipsPageModule)
      },
      {
        path: 'deals',
        loadChildren: () => import('./deals/deals.module').then(m => m.DealsPageModule)
      },
      {
        path: 'reviews',
        loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsPageModule)
      },
      {
        path: '',
        redirectTo: 'deals',
        // pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'deals',
    // pathMatch: 'full'
  },
  {
    path: 'user-options',
    loadChildren: () => import('./user-options/user-options.module').then( m => m.UserOptionsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MePageRoutingModule {}
