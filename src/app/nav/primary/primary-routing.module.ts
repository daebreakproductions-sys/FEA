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
