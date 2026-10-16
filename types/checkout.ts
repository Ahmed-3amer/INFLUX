export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  governorate: string;
  city: string;
  street: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  nameAr: string;
  nameEn?: string;
  quantity: number;
  price: number;
  discountPercent?: number;
  discountActive?: boolean;
}

export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  customer: CustomerInfo;
  items: OrderItem[];
  total: number;
  locale: string;
  paymentMethod: 'COD' | string;
}
