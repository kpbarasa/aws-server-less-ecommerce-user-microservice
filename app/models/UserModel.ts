import { AddressModel } from "./addressModel";

export interface UserModel {
    user_id: number;
    email: string;
    password: String;
    salt: string;
    phone: string;
    userType: "CUSTOMER" | "STORE_MANAGER",
    first_name: string,
    middle_name: string,
    last_name: string,
    profile_pic: string
    verification_code: number,
    expiry_date: string ,
    address: AddressModel[]
}