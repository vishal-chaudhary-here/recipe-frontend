import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IRecipe } from '../recipe.model';
import { RecipeService } from '../service/recipe.service';

@Component({
  selector: 'app-recipe-delete',
  templateUrl: './recipe-delete.component.html'
})
export class RecipeDeleteComponent {

  recipe?: IRecipe;

  constructor(protected recipeService: RecipeService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.recipeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }

}
