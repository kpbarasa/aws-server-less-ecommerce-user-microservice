import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { SignupInput } from "../models/dto/SignupInput";
import { AddressInput, ProfileInput } from "../models/dto/AddressInput";
import { VerificationInput } from "../models/dto/UpdateInput";
import { SusccessResponse, ErrorResponse } from "../utility/response";
import { UserModel } from "../models/UserModel";
import { UserRepository } from "../repository/userRepositiry";
import { AppValidationError } from "../utility/errors";
import { TimeDifference } from "../utility/dateHelper";
import { GenerateAccessCode } from "../utility/notification";
import {
  ValidatePassword,
  GetToken,
  verifyToken,
  GetSalt,
  GetHashedPassword,
} from "../utility/password";

@autoInjectable()
export class UserService {
  repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async ResonseWithError(event: APIGatewayProxyEventV2) {
    // ERORROR RESPONSE HERE
    return ErrorResponse(404, "request method is not supported !");
  }

  // ===================================================================
  // USER PROFILE
  // Validate users

  // DB PROCESS: DELETE cart by Cart ID
  // CHECK IF USER SHOPPING CART EXISTS
  // DB OPERATION: Find shopping cart

  // CHECK IF USER SHOPPING CART ITEM EXISTS
  // DB OPERATION: Find shopping cart item
  // ===================================================================
  async CreateUser(event: APIGatewayProxyEventV2) {
    try {
      // ===================================================================
      // Validate users
      // ===================================================================
      const input = plainToClass(SignupInput, event.body);

      const error = await AppValidationError(input);

      if (error) return ErrorResponse(404, error);

      const Salt = await GetSalt();

      const hashedPassword = await GetHashedPassword(
        input.password,
        Salt.toString()
      );

      input.phone;
      input.email.toString();
      input.password = hashedPassword;
      input.salt = Salt.toString();
      input.user_type;
      input.verification_code;
      input.first_name;
      input.last_name;
      input.middle_name;
      input.profile_pic;

      // ===================================================================
      // DB OPERATION: Find shopping cart item
      // ===================================================================
      const result = await this.repository.CreateAccount(input);

      if (result) {
        return SusccessResponse(result);
      } else {
        throw new Error("Sorry register user.");
      }
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  // ===================================================================
  // USER PROFILE
  // Validate users
  // DB OPERATION: Find user account
  // Validate passwords
  // Create token
  // ===================================================================
  async LoginUser(event: APIGatewayProxyEventV2) {
    try {
      // ===================================================================
      // Validate users
      // ===================================================================
      const input = plainToClass(SignupInput, event.body);

      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const data = await this.repository.FindAccount(input.email);

      // ===================================================================
      // Validate passwords
      // ===================================================================
      const verified = await ValidatePassword(
        input.password,
        data.password,
        data.salt
      );

      if (!verified) {
        throw new Error("Password does not match");
      }

      // ===================================================================
      // Create token
      // ===================================================================
      const token = await GetToken(data);

      if (token) {
        return SusccessResponse({ token });
      } else {
        throw new Error("Password does not match");
      }
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  // ===================================================================
  // VERIFY TOKEN
  // DB OPERATION: Save  confirm verification to DB
  // Validate passwords
  // Create token
  // ===================================================================
  async GetVerificationToken(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;

    const payload = await verifyToken(token);

    if (payload) {
      const { code, expiry } = GenerateAccessCode();

      // ===================================================================
      // DB OPERATION: Save  confirm verification to DB
      // ===================================================================
      await this.repository.UpdateVerificationCode(
        payload.user_id,
        code,
        expiry
      );

      return SusccessResponse({
        message: "verification code is sent to your registered mobile number!",
      });
    }
  }

  // ===================================================================
  // VERIFY USER
  // DB OPERATION: Find user account: verification_code, expiry_date
  // Verify user
  // ===================================================================
  async VerifyUser(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;

    const payload = await verifyToken(token);

    if (!payload) return ErrorResponse(404, "Authorization failed");

    const input = plainToClass(VerificationInput, event.body);

    const error = await AppValidationError(input);

    if (error) return ErrorResponse(404, error);

    // ===================================================================
    // DB OPERATION: Find user account: verification_code, expiry_date
    // ===================================================================
    const { verification_code, expiry_date } =
      await this.repository.FindAccount(payload.email.toString());

    if (verification_code.toString() === input.code) {
      const currentTime = new Date();
      const diff = TimeDifference(expiry_date, currentTime.toISOString(), "m");

      // ===================================================================
      // Verify user
      // ===================================================================
      if (diff > 0) {
        await this.repository.UpdateVerifyUser(payload.user_id);
        return SusccessResponse({ message: "user verified !" });
      } else {
        return ErrorResponse(403, "verification code expired !");
      }
    }

    return SusccessResponse({ message: "user verified !" });
  }

  // ===================================================================
  // USER PROFILE
  // Verify inputs
  // DB OPERATION: Create profile
  // ===================================================================
  async CreateProfile(event: APIGatewayProxyEventV2) {
    try {
      // ===================================================================
      // Verify inputs
      // ===================================================================
      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidationError(input);

      if (error) return ErrorResponse(404, error);

      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(404, "Authorization failed");

      // // CHECK PROFILE
      // const getProfile = await this.repository.GetProfile(payload.user_id);
      // if (getProfile) return ErrorResponse(404, "profile already exists");

      // ===================================================================
      // DB OPERATION: Create profile
      // ===================================================================
      const result = await this.repository.CreateProfile(
        payload.user_id,
        input,
        input.address
      );

      return SusccessResponse(result);
    } catch (error) {
      ErrorResponse(403, error);
    }
  }

  // ===================================================================
  // GET PROFILE
  // Verify Token
  // DB OPERATION: Get profile
  // ===================================================================
  async GetProfile(event: APIGatewayProxyEventV2) {
    try {
      // Verify Token
      const token = event.headers.authorization;

      const payload = await verifyToken(token);

      if (!payload) return ErrorResponse(404, "Authorization failed");

      // DB OPERATION: Get profile
      const result = await this.repository.GetProfile(payload.user_id);
      return SusccessResponse(result);
    } catch (error) {
      ErrorResponse(403, error);
    }
  }

  // ===================================================================
  // EDIT PROFILE
  // Verify User, Inputs
  // DB OPERATION: Find profile
  // DB OPERATION: Edit profile
  // ===================================================================
  async EditProfile(event: APIGatewayProxyEventV2) {
    try {
      // Verify User, Inputs
      const input = plainToClass(ProfileInput, event.body);
      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(404, "Authorization failed");

      // DB OPERATION: Find profile
      const getProfile = await this.repository.FindAccountById(payload.user_id);
      if (!getProfile) return ErrorResponse(404, "profile does not exist.");

      let userInfo = {} as UserModel;
      let addresInput = {} as AddressInput;

      input.email
        ? (userInfo.email = input.email)
        : (userInfo.email = getProfile.email);
      input.first_name
        ? (userInfo.first_name = input.first_name)
        : (userInfo.first_name = getProfile.first_name);
      input.last_name
        ? (userInfo.last_name = input.last_name)
        : (userInfo.last_name = getProfile.last_name);
      input.middle_name
        ? (userInfo.middle_name = input.middle_name)
        : (userInfo.middle_name = getProfile.middle_name);
      input.phone
        ? (userInfo.phone = input.phone)
        : (userInfo.phone = getProfile.phone);
      input.profile_pic
        ? (userInfo.profile_pic = input.profile_pic)
        : (userInfo.profile_pic = getProfile.profile_pic);
      input.password
        ? (userInfo.password = input.password)
        : (userInfo.password = getProfile.password);

      input.address.addressLine1
        ? (addresInput.addressLine1 = input.address.addressLine1)
        : (addresInput.addressLine1 = getProfile.address[0].address_line1);
      input.address.addressLine2
        ? (addresInput.addressLine2 = input.address.addressLine2)
        : (addresInput.addressLine2 = getProfile.address[0].address_line2);

      // DB OPERATION: Edit profile
      await this.repository.EditProfile(payload.user_id, userInfo, addresInput);

      return SusccessResponse({ message: "Success User profile updated" });
    } catch (error) {
      ErrorResponse(500, error);
    }
  }

  // PAYMENT TRANSACTIONS
  // ===================================================================
  // CREATE PAYMENT
  // ===================================================================
  async CreatePayment(event: APIGatewayProxyEventV2) {
    return SusccessResponse({ message: "response from create payment" });
  }

  // ===================================================================
  // COLLECT PAYMENT
  // ===================================================================
  async CollectPayment(event: APIGatewayProxyEventV2) {
    return SusccessResponse({ message: "response from create payment" });
  }

  // ===================================================================
  // GET PAYMENT
  // ===================================================================
  async GetPayment(event: APIGatewayProxyEventV2) {
    return SusccessResponse({ message: "response from get Cart" });
  }

  // ===================================================================
  // EDIT PAYMENT
  // ===================================================================
  async EditPayment(event: APIGatewayProxyEventV2) {
    return SusccessResponse({ message: "response from edit Cart" });
  }
}
