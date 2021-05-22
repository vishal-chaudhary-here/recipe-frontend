import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { RecipeUpdateComponent } from '../recipe-update/recipe-update.component';
import { RecipeRoutingResolveService } from './recipe-routing-resolve.service';

const routes: Routes = [{
  path: 'recipe',
  children: [{
      path: '',
      component: RecipeListComponent,
      data: {
        defaultSort: 'name,ASC',
      }
    },{
      path: 'new',
      component: RecipeUpdateComponent,
      resolve: {
        recipe: RecipeRoutingResolveService
      },
    },{
      path: ':id/edit',
      component: RecipeUpdateComponent,
      resolve: {
        recipe: RecipeRoutingResolveService
      }
    },{
      path: ':id/view',
      component: RecipeDetailComponent,
      resolve: {
        recipe: RecipeRoutingResolveService
      }
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule { }
