import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';
import { RecipeService } from './recipe.service';
import { IRecipe, Recipe } from '../recipe.model';
import { environment } from 'src/environments/environment';

describe('Service Tests', () => {
  describe('Recipe Service', () => {
    let service: RecipeService;
    let httpMock: HttpTestingController;
    let elemDefault: IRecipe;
    let expectedResult: IRecipe | IRecipe[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RecipeService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        href: 'AAAAAAA',
        name: 'AAAAAAA',
        creationDateTime: currentDate,
        isVegetarian: true,
        noOfPeopleCanEat: 4,
        cookingInstructions: [],
        ingredients: []
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            creationDateTime: currentDate.format(environment.DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toEqual(elemDefault);
      });

      it('should create a Recipe', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            creationDateTime: currentDate.format(environment.DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            creationDateTime: currentDate,
          },
          returnedFromService
        );

        service.create(new Recipe()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toEqual(expected);
      });

      it('should update a Recipe', () => {
        const returnedFromService = Object.assign(
          {
            id: 'AAAAAAA',
            href: 'AAAAAAA',
            name: 'AAAAAAA',
            creationDateTime: currentDate.format(environment.DATE_TIME_FORMAT),
            isVegetarian: true,
            noOfPeopleCanEat: 4,
            cookingInstructions: [],
            ingredients: []
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            creationDateTime: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toEqual(expected);
      });

      it('should partial update a Recipe', () => {
        const patchObject = Object.assign(
          {
            href: 'BBBBBB',
          },
          new Recipe()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            ingredients: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toEqual(expected);
      });

      it('should return a list of Recipe', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBBB',
            href: 'BBBBBB',
            name: 'BBBBBB',
            creationDateTime: currentDate.format(environment.DATE_TIME_FORMAT),
            isVegetarian: true,
            noOfPeopleCanEat: 4,
            cookingInstructions: [],
            ingredients: []
          },
          elemDefault
        );

        const expected = [Object.assign(
          {
            creationDateTime: currentDate,
          },
          returnedFromService
        )];

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toEqual(expected);
      });

      it('should delete a Recipe', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
