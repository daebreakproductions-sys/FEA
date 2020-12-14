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
    component: UserDetailPage
  },
  {
    path: ':id/followers',
    loadChildren: () => import('./followers/followers.module').then( m => m.FollowersPageModule)
  },
  {
    path: ':id/followees',
    loadChildren: () => import('./followees/followees.module').then( m => m.FolloweesPageModule)
  },
  {
    path: ':id/user-deals',
    loadChildren: () => import('./user-deals/user-deals.module').then( m => m.UserDealsPageModule)
  },
  {
    path: ':id/user-tips',
    loadChildren: () => import('./user-tips/user-tips.module').then( m => m.UserTipsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserDetailPageRoutingModule {}
