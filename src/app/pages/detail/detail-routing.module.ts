import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'market',
        loadChildren: () => import('./market/market-detail.module').then(m => m.MarketDetailPageModule)
      },
    ]
  },
  {
    path: 'deal',
    loadChildren: () => import('./deal/deal-detail.module').then( m => m.DealDetailPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user-detail.module').then( m => m.UserDetailPageModule)
  },
  {
    path: 'tip',
    loadChildren: () => import('./tip/tip-detail.module').then( m => m.TipDetailPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailRoutingModule { }
