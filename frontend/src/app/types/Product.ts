export interface ProductResponse {
  data: Product[];
}

export interface Product {
  rating: Rating;
  _id: string;
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
  category: string;
  __v: number;
}

interface Rating {
  rate: number;
  count: number;
}
