import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'deal',
    loadChildren: () => import('./edit-deals/edit-deals.module').then( m => m.EditDealsPageModule)
  },
  {
    path: 'tip',
    loadChildren: () => import('./edit-tips/edit-tips.module').then( m => m.EditTipsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRoutingModule { }
