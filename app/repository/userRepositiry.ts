import { AddressModel } from "app/models/addressModel";
import { AddressInput, ProfileInput } from "app/models/dto/AddressInput";
import { UserModel } from "../models/UserModel";
import { DBClient } from "../utility/databaseClient";
import { DBOperation } from "./dbOperations";
import { v4 as uuidv4 } from "uuid";
import { UserInputs } from "app/models/dto/SignupInput";
import moment from "moment";
// import * as md5 from 'md5';

export class UserRepository extends DBOperation {
  constructor() {
    super();
  }

  async CreateAccount(input: UserInputs) {
    const user_id = uuidv4();
    const currentDate = moment().format("YYYY-MM-DD hh:mm:ss");

    const queryString = `INSERT INTO users(
      user_id, 
      phone, 
      email, 
      password, 
      user_type, 
      salt, 
      verification_code,
      created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    const values = [
      user_id,
      input.phone,
      input.email,
      input.password,
      input.user_type,
      input.salt,
      input.verification_code,
      currentDate,
    ];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }

  async FindAccount(email: string) {
    const queryString = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount < 1) {
      throw new Error("User does not exist with provided Email Address");
    }

    return result.rows[0] as UserModel;
  }

  async FindAccountById(id: string) {
    const queryString = "SELECT * FROM users WHERE user_id = $1";
    const values = [id];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount < 1) {
      throw new Error("User does not exist with provided user id");
    }

    return result.rows[0] as UserModel;
  }

  async UpdateVerificationCode(userId: string, code: number, expiry: Date) {
    const updated_at = moment().format("YYYY-MM-DD hh:mm:ss");
    const queryString =
      "UPDATE users SET verification_code = $1, expiry_date = $2, updated_at = $3 WHERE user_id = $4 AND verified = FALSE RETURNING *";
    const values = [code, expiry, updated_at, userId];
    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("user already verified !");
  }

  async UpdateVerifyUser(userId: string) {
    const updated_at = moment().format("YYYY-MM-DD hh:mm:ss");
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
    phone: string
  ) {
    const updated_at = moment().format("YYYY-MM-DD hh:mm:ss");
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

  async UpdateUser(user_id: string, input: UserInputs) {
    const updated_at = moment().format("YYYY-MM-DD hh:mm:ss");

    const queryString =
      "UPDATE users SET phone=$1, email=$2, password=$3, first_name=$4, last_name=$5, middle_name=$6, profile_pic=$7, updated_at=$8 WHERE user_id = $9 RETURNING *";

    const values = [
      input.phone,
      input.email,
      input.password,
      input.first_name,
      input.last_name,
      input.middle_name,
      input.profile_pic,
      updated_at,
      user_id,
    ];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }

    throw new Error("Error updating user !");
  }

  async CreateProfile(
    userId: string,
    profileInput: ProfileInput,
    address: AddressInput
  ) {
    const {
      phone,
      email,
      password,
      first_name,
      last_name,
      middle_name,
      profile_pic,
    } = profileInput;

    const { addressLine1, addressLine2, city, state, post_code, country } =
      address;

    const address_id = uuidv4();

    const currentDate = moment().format("YYYY-MM-DD hh:mm:ss");

    // UPDATE USER INFORMATION
    await this.UpdateUser(userId, {
      phone,
      email,
      password,
      first_name,
      last_name,
      middle_name,
      profile_pic,
    });

    // USER ADDRESS INFORMATION
    const addQueryString = `INSERT INTO address(
      address_id,
      user_id,
      address_line1,
      address_line2,
      city,
      state,
      post_code,
      country,
      created_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;

    const values = [
      address_id,
      userId,
      addressLine1,
      addressLine2,
      city,
      state,
      post_code,
      country,
      currentDate,
    ];

    const addressRes = await this.executeQuery(addQueryString, values);

    if (addressRes.rowCount > 0) {
      return addressRes.rows[0];
    }

    throw new Error("Error creating profile !");
  }

  async GetProfile(userId: string) {
    const profileQueryString =
      "SELECT first_name, last_name, email, phone, user_type, stripe_id, payment_id, verified FROM users where user_id = $1";
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
      "SELECT address_id, address_line1, address_line2, city, post_code, country FROM address WHERE user_id = $1";
    const addressValues = [userId];

    const addressResult = await this.executeQuery(addressQuery, addressValues);

    if (addressResult.rowCount > 0) {
      userProfile.address = addressResult.rows as AddressModel[];
      userProfile.billing_address = addressResult.rows as AddressModel[];
      userProfile.shipinging_address = addressResult.rows as AddressModel[];
    }

    return userProfile;
  }

  async EditProfile(
    userId: string,
    profileInput: UserModel,
    address: AddressInput
  ) {
    const {
      phone,
      email,
      password,
      first_name,
      last_name,
      middle_name,
      profile_pic,
    } = profileInput;

    const { addressLine1, addressLine2, city, state, post_code, country } =
      address;

    await this.UpdateUser(userId, {
      phone,
      email,
      password,
      first_name,
      last_name,
      middle_name,
      profile_pic,
    });

    const queryString =
      "UPDATE address SET address_line1 =$1, address_line2 =$2, city =$3, post_code =$4, country =$5  WHERE user_id = $6";
    const values = [
      addressLine1,
      addressLine2,
      city,
      post_code,
      country,
      userId,
    ];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount > 0) {
      throw new Error("Error Updating profile !");
    }

    return true;
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

  async updateUserPayment(
    userId: string,
    paymentId: string,
    customerId: string
  ) {
    const queryString =
      "UPDATE users SET stripe_id=$1, payment_id=$2 WHERE user_id=$3 RETURNING *";
    const values = [customerId, paymentId, userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    return false
  }
}
