export interface Category {
  _id: string;
  name: string;
  imageUrl: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  categoryId: Category | string; // Category object when populated, string when sending to backend
}