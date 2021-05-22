import * as dayjs from "dayjs";

export interface IAlert {
  message?: string | null
}

export class Alert implements IAlert {
  constructor(
    public message?: string | null
  ) {}
}

export interface IError {
  code: string,
  reason: string,
  message?: string | null,
  status?: string | null
}

export class Error implements IError {
  constructor(
    public code: string,
    public reason: string,
    public message?: string | null,
    public status?: string | null
  ) {}
}

export interface IInstruction {
    stepNo?: number | null;
    stepDescription?: string;
}

export class Instruction implements IInstruction {
    constructor(
        public stepNo?: number | null,
        public stepDescription?: string
    ) {}
  }

export interface IRecipe {
  id?: string;
  href?: string;
  name?: string;
  creationDateTime?: dayjs.Dayjs;
  isVegetarian?: boolean;
  noOfPeopleCanEat?: number | null;
  cookingInstructions?: IInstruction[],
  ingredients?: string[];
}

export class Recipe implements IRecipe {
  constructor(
    public id?: string,
    public href?: string,
    public name?: string,
    public creationDateTime?: dayjs.Dayjs,
    public isVegetarian?: boolean,
    public noOfPeopleCanEat?: number | null,
    public cookingInstructions?: IInstruction[],
    public ingredients?: string[]
  ) {}
}

export function getRecipeIdentifier(recipe: IRecipe): string | undefined {
  return recipe.id;
}
