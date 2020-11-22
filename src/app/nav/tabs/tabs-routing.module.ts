import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guards/auth-guard.service';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'nearby',
        loadChildren: () => import('./../../pages/nearby/nearby.module').then(m => m.NearbyPageModule)
      },
      {
        path: 'friends',
        loadChildren: () => import('./../../pages/friends/friends.module').then(m => m.FriendsPageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./../../pages/login/login.module').then(m => m.LoginPageModule)
      },
      {
        path: 'signup',
        loadChildren: () => import('./../../pages/signup/signup.module').then(m => m.SignupPageModule)
      },
      {
        path: 'library',
        loadChildren: () => import('./../../pages/library/library.module').then( m => m.LibraryPageModule)
      },
          {
        path: 'me',
        loadChildren: () => import('./../../pages/me/me.module').then(m => m.MePageModule)
      },
      {
        path: 'user/add',
        loadChildren: () => import('./../../pages/user/add/add.module').then(m => m.UserAddPageModule)
      },
      {
        path: 'user/detail/{:id}',
        loadChildren: () => import('./../../pages/user/listing/listing.module').then(m => m.UsersPageModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./../../pages/user/detail/detail.module').then(m => m.UserPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/nearby',
        pathMatch: 'full'
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/tabs/nearby',
    pathMatch: 'full',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
