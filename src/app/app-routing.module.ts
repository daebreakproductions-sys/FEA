import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AlertAuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', loadChildren: () => import('./nav/primary/primary.module').then(m => m.PrimaryPageModule) },
  { path: '', loadChildren: () => import('./nav/tabs/tabs.module').then(m => m.TabsPageModule) },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'me',
    loadChildren: () => import('./pages/me/me.module').then( m => m.MePageModule)
  },
  {
    path: 'add',
    loadChildren: () => import('./pages/add/add.module').then( m => m.AddPageModule),
    canActivate: [AlertAuthGuard]
  },
  {
    path: 'market-modal',
    loadChildren: () => import('./pages/modals/market-modal/market-modal.module').then( m => m.MarketModalPageModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./pages/detail/detail-routing.module').then( m => m.DetailRoutingModule)
  },
  {
    path: 'feed',
    loadChildren: () => import('./pages/feed/feed.module').then( m => m.FeedPageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./pages/edit/edit-routing.module').then( m => m.EditRoutingModule),
    canActivate: [AlertAuthGuard]
  },
  {
    path: 'tag-modal',
    loadChildren: () => import('./pages/modals/tag-modal/tag-modal.module').then( m => m.TagModalPageModule)
  },
  {
    path: 'filter-modal',
    loadChildren: () => import('./pages/modals/filter-modal/filter-modal.module').then( m => m.FilterModalPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },

  //{ path: 'logout', loadChildren: () => import('./pages/auth/logout/logout.module').then(m => m.LogoutPageModule) },
  //{ path: '**', loadChildren: () => import('./pages/common/not-found/not-found.module').then(m => m.NotFoundPageModule) }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}