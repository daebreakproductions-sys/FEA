import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrimaryPage } from './primary.page';
import { AuthGuard } from './../../guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: PrimaryPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        children: [
          {
            path: '',
            loadChildren: () => import('@app/pages/user/listing/listing.module').then(m => m.UsersPageModule),
          }
        ]
      },
      { 
        path: 'user', 
        children: [
          {
            path: '',
            loadChildren: () => import('@app/pages/user/add/add.module').then(m => m.UserAddPageModule),
          }
        ]
      },
      { 
        path: 'user/:id', 
        children: [
          {
            path: '',
            loadChildren: () => import('@app/pages/user/detail/detail.module').then(m => m.UserPageModule),
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/nearby',
        pathMatch: 'full'
      }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [
    AuthGuard,
  ],
  exports: [RouterModule]
})
export class PrimaryPageRoutingModule {}
