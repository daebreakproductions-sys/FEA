import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'market',
        loadChildren: () => import('./market/market.module').then(m => m.MarketPageModule)
      },
    ]
  },
  {
    path: 'deal',
    loadChildren: () => import('./deal/deal.module').then( m => m.DealPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailRoutingModule { }
