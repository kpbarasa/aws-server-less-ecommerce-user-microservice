import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";

const APP_SECRET = "DA_app_secrete_HEre"
const saltRounds = 10;

export const GetSalt = async () => {
    return bcrypt.genSaltSync(saltRounds)
};

export const GetHashedPassword = async (password: string, salt: string) => {
    return bcrypt.hashSync(password, salt);
};

export const ValidatePassword = async (

    enteredPassword: string,
    savedPassword: String,
    salt: string

) => {
    console.log(
        enteredPassword,
        savedPassword,
        salt
    );

    return (await GetHashedPassword(enteredPassword, salt)) == savedPassword
};

export const GetToken = async ({ user_id, email, password, salt, phone, userType }: UserModel) => {
    
    return jwt.sign({
        user_id,
        email,
        password,
        salt,
        phone,
        userType
    }, APP_SECRET, { expiresIn: "60m" })
};

export const verifyToken = async (token: string): Promise<UserModel | false> => {
    try {
        
        if (token !== "") {

            const payload = await jwt.verify(token.split(' ')[1], APP_SECRET)
            
            return payload as UserModel
        }
        return false

    } catch (error) {
        return false
    }
}