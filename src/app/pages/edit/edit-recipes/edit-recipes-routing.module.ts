import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRecipesPage } from './edit-recipes.page';

const routes: Routes = [
  {
    path: ':id',
    component: EditRecipesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRecipesPageRoutingModule {}
