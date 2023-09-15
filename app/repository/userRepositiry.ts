import { AddressModel } from "app/models/addressModel";
import { ProfileInput } from "app/models/dto/AddressInput";
import { UserModel } from "../models/UserModel";
import { DBClient } from "../utility/databaseClient";
import { DBOperation } from "./dbOperations";

export class UserRepository extends DBOperation {
  constructor() {
    super();
  }

  async CreateAccount(
    email: string,
    password: string,
    salt: string,
    phone: string,
    userType: string
  ) {

    const queryString =
      "INSERT INTO users(phone, email, password, salt, user_type) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [phone, email, password, salt, userType];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }

  async FindAccount(email: string) {
    const queryString =
      "SELECT user_id, phone, email, password, verification_code, expiry_date, salt, user_type FROM users WHERE email = $1";
    const values = [email];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount < 1) {
      throw new Error("User does not exist with provided Email Address");
    }

    return result.rows[0] as UserModel;
  }

  async UpdateVerificationCode(userId: number, code: number, expiry: Date) {
    const updated_at = new Date();
    const queryString =
      "UPDATE users SET verification_code = $1, expiry_date = $2, updated_at = $3 WHERE user_id = $4 AND verified = FALSE RETURNING *";
    const values = [code, expiry, updated_at, userId];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("user already verified !");
  }

  async UpdateVerifyUser(userId: number) {
    const updated_at = new Date();
    const queryString =
      "UPDATE users SET verified = TRUE WHERE user_id = $1 AND verified = FALSE";
    const values = [userId];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }

    throw new Error("user already verified !");
  }

  async UpdateAccount(
    email: string,
    password: string,
    salt: string,
    phone: string,
    userType: string
  ) {
    const updated_at = new Date();
    const client = await DBClient();

    await client.connect();

    const result = await client.query(
      "UPDATE users SET email = $1, password = $2, salt = $3, phone = $4, updated_at = $5  WHERE user_id = $2",
      [email, password, salt, phone, updated_at]
    );

    await client.end();

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }

  async UpdateUser(
    userId: number,
    firstName: string,
    lastName: string,
    userType: string
  ) {
    const queryString =
      "UPDATE users SET first_name = $1, last_name = $2, user_type = $3 WHERE user_id = $4 RETURNING *";
    const values = [firstName, lastName, userType, userId];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }

    throw new Error("Error updating user !");
  }

  async CreateProfile(
    userId: number,
    {
      firstName,
      lastName,
      userType,
      address: { addressLine1, addressLine2, city, postCode, country },
    }: ProfileInput
  ) {
    const checkAddress = await this.GetProfile(userId);

    await this.UpdateUser(userId, firstName, lastName, userType);

    const queryString =
      "INSERT INTO address(user_id, address_line1, address_line2, city, post_code, country) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [
      userId,
      addressLine1,
      addressLine2,
      city,
      postCode,
      country,
    ];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }

    throw new Error("Error creating profile !");
  }

  async GetProfile(userId: number) {
    const profileQueryString =
      "SELECT first_name, last_name, email, phone, user_type, verified FROM users where user_id = $1";
    const profileValues = [userId];

    const profileResult = await this.executeQuery(
      profileQueryString,
      profileValues
    );

    if (profileResult.rowCount < 1) {
      throw new Error("Error User Profile Does Not Exist !");
    }

    const userProfile = profileResult.rows[0] as UserModel;

    const addressQuery =
      "SELECT id, address_line1, address_line2, city, post_code, country FROM address WHERE user_id = $1";
    const addressValues = [userId];

    const addressResult = await this.executeQuery(addressQuery, addressValues);

    if (addressResult.rowCount > 0) {
      userProfile.address = addressResult.rows as AddressModel[];
    }

    return userProfile;
  }

  async EditProfile(
    userId: number,
    {
      firstName,
      lastName,
      userType,
      address: { addressLine1, addressLine2, city, postCode, country, id },
    }: ProfileInput
  ) {
    await this.UpdateUser(userId, firstName, lastName, userType);

    const queryString =
      "UPDATE address SET address_line1 =$1, address_line2 =$2, city =$3, post_code =$4, country =$5  WHERE id = $6";
    const values = [addressLine1, addressLine2, city, postCode, country, id];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      throw new Error("Error Updating profile !");
    }

    return true;
  }

  async ValidateUser(userId: number) {
    const client = await DBClient();

    await client.connect();

    const result = await client.query("DELETE FROM users WHERE user_id = $1", [
      userId,
    ]);

    await client.end();

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }

  async DeleteAccount(user_id: string) {
    const client = await DBClient();

    await client.connect();

    const result = await client.query("DELETE FROM users WHERE user_id = $1", [
      user_id,
    ]);

    await client.end();

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }
}
