import { LoginInput } from "./LoginInput";
import { Length } from "class-validator";

export class SignupInput extends LoginInput {
    @Length(10,13)
    phone: string;
    email: string;
    password: string;
    salt: string;
    user_type: string;
    verification_code: string;
    expiry_date: string;
    verified: boolean;
    first_name: string;
    last_name: string;
    middle_name: string;
    profile_pic: string;
    created_at: string;
    updated_at: string;

}

export class UserInputs  {
    phone?: string;
    email?: string;
    password?: string;
    salt?: string;
    user_type?: string;
    verification_code?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    profile_pic?: string;
  }