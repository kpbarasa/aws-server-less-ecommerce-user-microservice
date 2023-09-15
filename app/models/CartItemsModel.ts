export interface ShoppingCartItemModel {
    cart_id?: string;
    item_id?: string;
    product_id: string;
    name: string;
    images: string[];
    price: number;
    item_qty: number;variation_id: number;
    tax_class: string; 
    subtotal: string; 
    subtotal_tax: string;
    total: string;
}