import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { RecipeService } from '../service/recipe.service';
import { IRecipe, Recipe } from '../recipe.model';
import * as dayjs from 'dayjs';

@Injectable({ providedIn: 'root' })
export class RecipeRoutingResolveService implements Resolve<IRecipe> {
  constructor(protected service: RecipeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRecipe> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      const fields = {
        'fields': route.queryParams['fields']
      };
      return this.service.find(id, fields).pipe(
        mergeMap((recipe: HttpResponse<IRecipe>) => {
          if (recipe.body) {
            return of(recipe.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }

    const recipe = {
      ... new Recipe(),
      isVegetarian: false,
      creationDateTime: dayjs()
    };

    return of(recipe);
  }
}
