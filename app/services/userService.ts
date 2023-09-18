import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { UserRepository } from "../repository/userRepositiry";
import { SignupInput } from "../models/dto/SignupInput";
import { ProfileInput } from "../models/dto/AddressInput";
import { VerificationInput } from "../models/dto/UpdateInput";
import { TimeDifference } from "../utility/dateHelper";
import { AppValidationError } from "../utility/errors";
import { SusccessResponse, ErrorResponse } from "../utility/response";
import {
  GenerateAccessCode,
  SendVerificationCode,
} from "../utility/notification";
import {
  GetSalt,
  GetHashedPassword,
  ValidatePassword,
  GetToken,
  verifyToken,
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

  // USER PROFILE
  async CreateUser(event: APIGatewayProxyEventV2) {
    try {
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

      const data = await this.repository.CreateAccount(input);

      return SusccessResponse(data);
    } catch (error) {
      ErrorResponse(500, error);
    }
  }

  async LoginUser(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(SignupInput, event.body);

      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const data = await this.repository.FindAccount(input.email);

      const verified = await ValidatePassword(
        input.password,
        data.password,
        data.salt
      );

      // Check / Validate user password
      if (!verified) {
        throw "Password does not match";
      }

      const token = await GetToken(data);

      return SusccessResponse({ token });
    } catch (error) {
      ErrorResponse(500, error);
    }
  }

  // USER AUTHENTICATION
  async GetVerificationToken(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;

    const payload = await verifyToken(token);

    if (payload) {
      const { code, expiry } = GenerateAccessCode();

      // Save on DB  to confirm verification.
      await this.repository.UpdateVerificationCode(
        payload.user_id,
        code,
        expiry
      );

      // const response = await SendVerificationCode(code, payload.phone)
      return SusccessResponse({
        message: "verification code is sent to your registered mobile number!",
      });
    }
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;

    const payload = await verifyToken(token);

    if (!payload) return ErrorResponse(404, "Authorization failed");

    const input = plainToClass(VerificationInput, event.body);

    const error = await AppValidationError(input);

    if (error) return ErrorResponse(404, error);

    const { verification_code, expiry_date } =
      await this.repository.FindAccount(payload.email.toString());

    // Find user Account
    if (verification_code.toString() === input.code) {
      // Check expiry date
      const currentTime = new Date();
      const diff = TimeDifference(expiry_date, currentTime.toISOString(), "m");

      if (diff > 0) {
        await this.repository.UpdateVerifyUser(payload.user_id);
        return SusccessResponse({ message: "user verified !" });
      } else {
        return ErrorResponse(403, "verification code expired !");
      }

      // Update DB
    }

    return SusccessResponse({ message: "user verified !" });
  }

  // USER PROFILE
  async CreateProfile(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(404, "Authorization failed");

      const Salt = await GetSalt();

      const hashedPassword = await GetHashedPassword(
        input.password,
        Salt.toString()
      );

      input.password = hashedPassword;

      // DB Operation
      const result = await this.repository.CreateProfile(
        payload.user_id,
        input
      );
      

      return SusccessResponse(result);

    } catch (error) {
      ErrorResponse(403, error);
    }
  }

  async GetProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;

      const payload = await verifyToken(token);

      if (!payload) return ErrorResponse(404, "Authorization failed");

      // DB Operation
      const result = await this.repository.GetProfile(payload.user_id);
      return SusccessResponse(result);
      
    } catch (error) {
      ErrorResponse(403, error);
    }
  }

  async EditProfile(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(ProfileInput, event.body);
      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(404, "Authorization failed");

      // DB Operation
      await this.repository.EditProfile(payload.user_id, input);
      return SusccessResponse({ message: "Success User profile updated" });
    } catch (error) {
      ErrorResponse(500, error);
    }
  }

  // PAYMENT TRANSACTION
  async CreatePayment(event: APIGatewayProxyEventV2) {
    return SusccessResponse({ message: "response from create payment" });
  }

  async GetPayment(event: APIGatewayProxyEventV2) {
    return SusccessResponse({ message: "response from get Cart" });
  }

  async EditPayment(event: APIGatewayProxyEventV2) {
    return SusccessResponse({ message: "response from edit Cart" });
  }
}
