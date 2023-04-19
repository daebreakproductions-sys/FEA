import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertAuthGuard } from '@app/guards/auth-guard.service';
import { TabsPage } from './tabs.page';
import { LoginAuthGuard } from '@app/guards/login-guard.service';

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
        path: 'feed',
        loadChildren: () => import('./../../pages/feed/feed.module').then(m => m.FeedPageModule)
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
        loadChildren: () => import('./../../pages/me/me.module').then(m => m.MePageModule),
        canActivate: [LoginAuthGuard]
      },
      {
        path: '',
        redirectTo: '/tabs/nearby',
        pathMatch: 'full'
      }
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/nearby',
    pathMatch: 'full',
    canActivate: [AlertAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
