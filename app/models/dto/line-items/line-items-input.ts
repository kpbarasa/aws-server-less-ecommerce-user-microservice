export class LineItemsInput {
    id: number;	// Item ID.READ-ONLY
    name: string; // Product name.
    product_id: number; //	Product ID.
    variation_id: number; //	Variation ID, if applicable.
    quantity: number; // Quantity ordered.
    tax_class: string; // Slug of the tax class of product.
    subtotal: string; //	Line subtotal(before discounts).
    subtotal_tax: string; //	Line subtotal tax(before discounts).READ - ONLY
    total: string; //	Line total(after discounts).
    total_tax: string; //	Line total tax(after discounts).READ - ONLY
    taxes: string[]; //	Line taxes.See Order - Taxes propertiesREAD - ONLY
    meta_data: string[]; //	Meta data.See Order - Meta data properties
    sku: string;	// Product SKU.READ - ONLY
    price: string;	// Product price.
}