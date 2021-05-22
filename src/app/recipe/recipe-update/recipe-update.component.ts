import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Alert, IError, IInstruction, Instruction, IRecipe, Recipe } from '../recipe.model';
import { RecipeService } from '../service/recipe.service';

@Component({
  selector: 'app-recipe-update',
  templateUrl: './recipe-update.component.html'
})
export class RecipeUpdateComponent implements OnInit {
  isSaving = false;
  instructions: IInstruction[] = [];
  recipe: IRecipe | undefined;
  alert: Alert = {
    message: ''
  };

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    creationDateTime: [null],
    isVegetarian: [null],
    noOfPeopleCanEat: [null],
    cookingInstructions: [null],
    ingredients: [null],
    instruction: [null]
  });

  constructor(protected recipeService: RecipeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recipe }) => {
      this.recipe = recipe;
      this.updateForm(recipe);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recipe = this.createFromForm();
    if (recipe.id !== undefined) {
      recipe.href = undefined;
      recipe.name = undefined;
      this.subscribeToSaveResponse(this.recipeService.update(recipe));
    } else {
      this.subscribeToSaveResponse(this.recipeService.create(recipe));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecipe>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      (resErr: HttpErrorResponse) => this.onSaveError(resErr.error, resErr.status)
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(err: IError, status: number): void {
    this.alert.message = err.message;
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(recipe: IRecipe): void {
    if(recipe.cookingInstructions) {
      this.instructions = recipe.cookingInstructions;
    }

    this.editForm.patchValue({
      id: recipe.id,
      name: recipe.name,
      creationDateTime: recipe.creationDateTime ? recipe.creationDateTime.format(environment.DATE_TIME_FORMAT) : null,
      isVegetarian: recipe.isVegetarian,
      noOfPeopleCanEat: recipe.noOfPeopleCanEat,
      ingredients: this.setIngredients(recipe.ingredients)
    });
  }

  protected createFromForm(): IRecipe {
    return {
      ...new Recipe(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      creationDateTime: this.editForm.get(['creationDateTime'])!.value
        ? dayjs(this.editForm.get(['creationDateTime'])!.value, environment.DATE_TIME_FORMAT)
        : undefined,
      isVegetarian: this.editForm.get(['isVegetarian'])!.value,
      noOfPeopleCanEat: this.editForm.get(['noOfPeopleCanEat'])!.value,
      cookingInstructions: this.instructions,
      ingredients: this.getIngredients()
    };
  }

  protected getIngredients(): string[] {
    const ingredient = this.editForm.get(['ingredients'])!.value;
    if(ingredient) {
      return ingredient.split(",");
    }
    return [];
  }

  protected setIngredients(ingredients: string[] | undefined): string {
    let ingredient: string = "";
    if(ingredients) {
      ingredients.forEach(e => {
        ingredient = ingredient.concat(e).concat(',');
      });  
    }
    return ingredient;
  }

  addInstruction(description?: string) {
    if(this.editForm.get(['instruction'])!.value) {
      const instruction =  {
        ...new Instruction(),
        stepNo:  null,
        stepDescription: description ? description : this.editForm.get(['instruction'])!.value
      };
      this.editForm.patchValue({
        instruction: null
      });
      this.instructions.push(instruction);
    }
  }

  removeInstruction(stepNo: number) {
    this.instructions.splice(stepNo, 1);
  }

}
