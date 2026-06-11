export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

export interface CreateProductCommand {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

export interface UpdateProductCommand {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}
