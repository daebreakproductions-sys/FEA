import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./nav/primary/primary.module').then(m => m.PrimaryPageModule) },
  { path: '', loadChildren: () => import('./nav/tabs/tabs.module').then(m => m.TabsPageModule) },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
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