export class TaxLineItems_Input {
    id: number;	// Item ID.READ-ONLY
    rate_code: string;	// Tax rate code.READ-ONLY
    rate_id: string; //	Tax rate ID.READ-ONLY
    label: string; //	Tax rate label.READ-ONLY
    compound: boolean; //	Show if is a compound tax rate.READ-ONLY
    tax_total: string; //	Tax total (not including shipping taxes).READ-ONLY
    shipping_tax_total: string; //	Shipping tax total.READ-ONLY
    meta_data: string[]; //Meta data. See Order - Meta data properties
}