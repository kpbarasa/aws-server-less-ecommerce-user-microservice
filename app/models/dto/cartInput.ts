import { IsNumber, Length } from "class-validator";

export class CartInput {
    @IsNumber()
    qty: number;

    // @Length(6, 24)
    productId: number;
    cart_id?: string;
    item_id?: string;
    name: string;
    images: string[];
    price: number;
    item_qty: number;variation_id: number;
    tax_class: string; 
    subtotal: string; 
    subtotal_tax: string;
    total: string;
}

export class UpdateCartInput {
    @IsNumber()
    qty: number;
}