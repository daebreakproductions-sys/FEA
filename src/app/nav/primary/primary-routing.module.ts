import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrimaryPage } from './primary.page';
import { AlertAuthGuard } from './../../guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: PrimaryPage,
    canActivate: [AlertAuthGuard],
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
    AlertAuthGuard,
  ],
  exports: [RouterModule]
})
export class PrimaryPageRoutingModule {}
