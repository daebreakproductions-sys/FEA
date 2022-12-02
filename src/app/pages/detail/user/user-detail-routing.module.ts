import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDetailPage } from './user-detail.page';

const routes: Routes = [
  {
    path: '',
    component: UserDetailPage
  },
  {
    path: ':id',
    component: UserDetailPage,
    children: [
      {
        path: 'user-recipes',
        children: [
          {
            path: '',
            loadChildren: () => import('./user-recipes/user-recipes.module').then( m => m.UserRecipesPageModule)
          }
        ]
      },
      {
        path: 'user-tips',
        children: [
          {
            path: '',
            loadChildren: () => import('./user-tips/user-tips.module').then( m => m.UserTipsPageModule)
          }
        ]
      },
      {
        path: 'user-deals',
        children: [
          {
            path: '',
            loadChildren: () => import('./user-deals/user-deals.module').then( m => m.UserDealsPageModule)
          }
        ]
      },
      {
        path: 'user-reviews',
        children: [
          {
            path: '',
            loadChildren: () => import('./user-reviews/user-reviews.module').then( m => m.UserReviewsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'user-deals'
      }
    ]
  },
  {
    path: ':id/followers',
    loadChildren: () => import('./followers/followers.module').then( m => m.FollowersPageModule)
  },
  {
    path: ':id/followees',
    loadChildren: () => import('./followees/followees.module').then( m => m.FolloweesPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDetailPageRoutingModule {}
