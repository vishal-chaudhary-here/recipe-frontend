import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipeRoutingModule } from './recipe-route/recipe-routing.module';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeUpdateComponent } from './recipe-update/recipe-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeDeleteComponent } from './recipe-delete/recipe-delete.component';

@NgModule({
  declarations: [
    RecipeListComponent,
    RecipeUpdateComponent,
    RecipeDetailComponent,
    RecipeDeleteComponent
  ],
  imports: [
    CommonModule,
    RecipeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    SharedModule
  ]
})
export class RecipeModule { }
