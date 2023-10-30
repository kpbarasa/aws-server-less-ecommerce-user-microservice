export class ShoppingCartModel {
  cart_id: string; 
  user_id: string; 
  items: number; 
  tax_class: string[]; 
  subtotal: number; 
  total: number; 
  total_tax: number; 
  taxes:string[];
  created_at: string;
}

export class ShoppingCartItemModel {
  cart_id?: string;
  item_id: string;
  product_id: string;
  name: string;
  images: string[];
  price: number;
  quantity: number;
  variation_id: string;
  tax_class: string; 
  subtotal: number; 
  total_tax: number;
  total: number;
}

export class ShoppingCartItemsInputs {
      data: {
        product_id: string,
        name: string,
        price: number,
        images: string[]
      };
      cart_id: string;
      quantity: number;
      subtotal: number;
      total_tax: number;
      total: number;
}