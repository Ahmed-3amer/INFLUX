export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  price: number;
  size: string;
  concentration: string;
  discountPercent: number;
  discountActive: boolean;
  inStock: boolean;
  featured?: boolean;
  scentCharacterAr: string;
  scentCharacterEn: string;
  longevityAr?: string;
  longevityEn?: string;
  sillageAr?: string;
  sillageEn?: string;
  occasionAr?: string;
  occasionEn?: string;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
  topNotesAr: string[];
  topNotesEn: string[];
  heartNotesAr: string[];
  heartNotesEn: string[];
  baseNotesAr: string[];
  baseNotesEn: string[];
}

export type ProductFormData = Omit<Product, 'price' | 'discountPercent' | 'topNotesAr' | 'topNotesEn' | 'heartNotesAr' | 'heartNotesEn' | 'baseNotesAr' | 'baseNotesEn'> & {
  price: number | string;
  discountPercent: number | string;
  topNotesAr: string[] | string;
  topNotesEn: string[] | string;
  heartNotesAr: string[] | string;
  heartNotesEn: string[] | string;
  baseNotesAr: string[] | string;
  baseNotesEn: string[] | string;
};

/**
 * Calculates the final price of a product after applicable active discount.
 */
export function calculateEffectivePrice(product: Product): number {
  if (product.discountActive && product.discountPercent > 0) {
    return Math.round(product.price * (1 - product.discountPercent / 100));
  }
  return product.price;
}
