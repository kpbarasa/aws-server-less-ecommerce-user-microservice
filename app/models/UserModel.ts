import { AddressModel } from "./addressModel";

export interface UserModel {
    user_id: string;
    email: string;
    password: String;
    salt: string;
    phone: string;
    user_type: "CLIENT_CUSTOMER" | "CLIENT_STORE_MANAGER",
    first_name: string,
    middle_name: string,
    last_name: string,
    profile_pic: string
    verification_code: number,
    expiry_date: string ,
    address: AddressModel[],
    billing_address?: AddressModel[],
    shipinging_address?: AddressModel[]
}