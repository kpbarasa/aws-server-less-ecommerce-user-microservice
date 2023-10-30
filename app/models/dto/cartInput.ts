import { IsNumber, Length } from "class-validator";

export class CartInput {
  @IsNumber()
  quantity: number;
  productId: string;

  cart_id?: string;
  user_id: string;
  tax_class: string;
  taxes: string[];

  // @IsNumber()
  // items?: number;

  total_tax: number;
  subtotal: number;
  total: number;
}

export class UpdateCartInput {
  @IsNumber()
  quantity: number;
  productId: string;

  cart_id?: string;
  user_id: string;
  tax_class: string;
  taxes: string;
  @IsNumber()
  items?: string;
  total_tax: number;
  subtotal: number;
  total: number;
}
