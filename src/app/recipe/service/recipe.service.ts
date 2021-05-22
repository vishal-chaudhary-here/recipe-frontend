import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getRecipeIdentifier, IRecipe } from '../recipe.model';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { environment } from 'src/environments/environment';

export const createRequestOption = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();

  if (req) {
    Object.keys(req).forEach(key => {
      //if (key !== 'sort') {
        options = options.set(key, req[key]);
      //}
    });

    /*if (req.sort) {
      req.sort.forEach((val: string) => {
        options = options.append('sort', val);
      });
    }*/
  }

  return options;
};

export type EntityResponseType = HttpResponse<IRecipe>;
export type EntityArrayResponseType = HttpResponse<IRecipe[]>;

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  public resourceUrl = environment.RECIPE_API_PATH; 

  constructor(protected http: HttpClient) { }

  create(recipe: IRecipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipe);
    return this.http
      .post<IRecipe>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(recipe: IRecipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipe);
    return this.http
      .put<IRecipe>(`${this.resourceUrl}/${getRecipeIdentifier(recipe) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(recipe: IRecipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipe);
    return this.http
      .patch<IRecipe>(`${this.resourceUrl}/${getRecipeIdentifier(recipe) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string, req?: any): Observable<EntityResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRecipe>(`${this.resourceUrl}/${id}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRecipe[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(recipe: IRecipe): IRecipe {
    return Object.assign({}, recipe, {
      creationDateTime: recipe.creationDateTime ? dayjs(recipe.creationDateTime).format(environment.DATE_TIME_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creationDateTime = res.body.creationDateTime ? dayjs(res.body.creationDateTime) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((recipe: IRecipe) => {
        recipe.creationDateTime = recipe.creationDateTime ? dayjs(recipe.creationDateTime) : undefined;
      });
    }
    return res;
  }
 
}
