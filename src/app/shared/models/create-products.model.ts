export interface Dimension {
  widthInCm: number;
  heightInCm: number;
}

export interface Presentation {
  volumeMl: number;
  price: number;
  stock: number;
  dimension: Dimension;
}

export interface CreateProduct {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  presentations: Presentation[];
}


