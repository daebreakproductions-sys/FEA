import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRecipesPage } from './add-recipes.page';

const routes: Routes = [
  {
    path: '',
    component: AddRecipesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRecipesPageRoutingModule {}
