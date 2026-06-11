export interface Categories {
  id: string;
  name: string;
  slug: string;
}

export interface CreateCategoryCommand {
  name: string;
}

export interface UpdateCategoryCommand {
  name: string;
}
