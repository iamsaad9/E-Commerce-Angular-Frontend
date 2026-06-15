export interface Categories {
  id: string;
  name: string;
  slug: string;
}

export interface CreateCategoryCommand {
  name: string;
}

export interface CreateCategoryResponse {
  Category: Categories;
}

export interface UpdateCategoryCommand {
  name: string;
}

export interface GetAllCategoriesResponse {
  categories: Categories[];
}

export interface GetCategoryResponse {
  category: Categories;
}
