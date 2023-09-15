export class FeeLineItems_Input {
    id: string;	//Item ID.READ-ONLY
    name: string;	//Fee name.
    tax_class: string;	//Tax class of fee.
    tax_status: string;	//Tax status of fee. Options: taxable and none.
    total: string;	//Line total (after discounts).
    total_tax: string;	//Line total tax (after discounts).READ-ONLY
    taxes: string[];	//Line taxes. See Order - Taxes propertiesREAD-ONLY
    meta_data: string[];	//Meta data. See Order - Meta data properties
}