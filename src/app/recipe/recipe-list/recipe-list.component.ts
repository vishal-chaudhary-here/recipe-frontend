import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RecipeDeleteComponent } from '../recipe-delete/recipe-delete.component';
import { IError, IRecipe } from '../recipe.model';
import { RecipeService } from '../service/recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html'
})
export class RecipeListComponent implements OnInit {
  recipes?: IRecipe[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = environment.ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected recipeService: RecipeService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.recipeService
      .query({
        offset: (pageToLoad - 1) * this.itemsPerPage,
        limit: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IRecipe[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        (resErr: HttpErrorResponse) => {
          this.isLoading = false;
          this.onError(resErr.error, resErr.status);
        }
      );
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(index: number, item: IRecipe): string {
    return item.id!;
  }

  delete(recipe: IRecipe): void {
    const modalRef = this.modalService.open(RecipeDeleteComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.recipe = recipe;
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  protected sort(): string {
    let sort = this.ascending ? 'ASC=' : 'DESC=';
    sort = sort.concat(this.predicate);
    if (this.predicate !== 'id') {
      sort = sort.concat(',').concat('id');
    }
    return sort;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'ASC';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IRecipe[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/recipe'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'ASC' : 'DESC'),
        },
      });
    }
    this.recipes = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(err: IError, status: number): void {
    this.recipes = [];
    this.ngbPaginationPage = this.page ?? 1;
  }

}
