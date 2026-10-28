export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  colors: ProductColor[];
  description: string;
  dimensions?: string;
  material?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  id: string; // unique item id (product id + color)
  product: Product;
  selectedColor: ProductColor;
  quantity: number;
  customText?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}
