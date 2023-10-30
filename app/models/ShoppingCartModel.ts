export interface ShoppingCartModel {
    cart_id: number;
    user_id: number;
    items: number;
    tax_class: string; 
    subtotal: number; 
    total: number;
    total_tax: number;
    taxes: string;
}