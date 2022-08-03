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
  {
    path: 'foodpantrysite',
    loadChildren: () => import('./foodpantrysite/foodpantrysite-detail.module').then( m => m.FoodPantrySiteDetailPageModule)
  },
  {
    path: 'recipe',
    loadChildren: () => import('./recipe/recipe-detail/recipe-detail.module').then( m => m.RecipeDetailPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailRoutingModule { }
