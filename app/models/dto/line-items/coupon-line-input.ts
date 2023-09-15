export class CouponLineItems_Input {
    id: number;	//Item ID.READ-ONLY
    code: string;	//Coupon code.
    discount: string;	//Discount total.READ-ONLY
    discount_tax: string;	//Discount total tax.READ-ONLY
    meta_data: string[];	//Meta data. See Order - Meta data properties
}