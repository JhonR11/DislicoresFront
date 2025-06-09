export interface Dimension {
  widthInCm: number;
  heightInCm: number;
}

export interface Presentation {
  _id?: string;
  dimension: Dimension;
  volumeMl: number;
  price: number;
  stock: number;
}

export interface Category {
  _id?: string;
  name: string;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  imageUrl: string;
  presentations: Presentation[];
  category: Category;
  createdAt?: string;
  updatedAt?: string;
}
