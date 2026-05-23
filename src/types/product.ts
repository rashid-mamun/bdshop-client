export interface Product {
  _id: string;
  name: string;
  model: string;
  price: number;
  img: string;
  imgPublicId?: string;
  imgStorage?: 'cloudinary' | 'local' | 'external' | '';
  description?: string;
  category?: string;
  config?: string;
  madeIn?: string;
  date?: string;
  images?: string[];
  stock?: number;
  averageRating?: number;
  reviewCount?: number;
  originalPrice?: number;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  discountPercent?: number;
  isNewArrival?: boolean;
}

export type ProductPreview = Pick<Product, '_id' | 'name' | 'model' | 'price' | 'img'> &
  Partial<Pick<Product, 'category' | 'originalPrice' | 'discountPercent' | 'stock' | 'averageRating' | 'reviewCount'>>;
