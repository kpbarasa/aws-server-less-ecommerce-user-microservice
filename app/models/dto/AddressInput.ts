import {Length} from "class-validator";

export class AddressInput {
    id?: number;

    @Length(3, 32)
    addressLine1: string;
    addressLine2: string;

    @Length(3, 12)
    city: string;

    @Length(3, 50)
    state: string;

    @Length(4, 6)
    post_code: string;

    @Length(2, 3)
    country: string;
}

export class BillingAddressInput {
    id?: number;

    @Length(3, 32)
    addressLine1: string;
    addressLine2: string;

    @Length(3, 50)
    city: string;

    @Length(3, 50)
    state: string;

    @Length(4, 6)
    post_code: string;

    @Length(2, 3)
    country: string;

}

export class ShippingAddressInput {
    id?: number;

    @Length(3, 32)
    addressLine1: string;
    addressLine2: string;

    @Length(3, 50)
    city: string;

    @Length(3, 50)
    state: string;

    @Length(4, 6)
    post_code: string;

    @Length(2, 3)
    country: string;

}

export class ProfileInput {

    @Length(3, 32)
    first_name: string;

    @Length(3, 32)
    last_name: string;

    @Length(2, 32)
    middle_name: string;

    @Length(10, 20) 
    phone: string; 

    @Length(8, 50) 
    email: string;

    @Length(8, 16) 
    password: string;

    profile_pic: string;

    address: AddressInput;

    shipping_address?: ShippingAddressInput;

    billing_address?: BillingAddressInput;
}