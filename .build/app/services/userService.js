"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tsyringe_1 = require("tsyringe");
const class_transformer_1 = require("class-transformer");
const userRepositiry_1 = require("../repository/userRepositiry");
const SignupInput_1 = require("../models/dto/SignupInput");
const AddressInput_1 = require("../models/dto/AddressInput");
const UpdateInput_1 = require("../models/dto/UpdateInput");
const dateHelper_1 = require("../utility/dateHelper");
const errors_1 = require("../utility/errors");
const response_1 = require("../utility/response");
const notification_1 = require("../utility/notification");
const password_1 = require("../utility/password");
let UserService = class UserService {
    constructor(repository) {
        this.repository = repository;
    }
    ResonseWithError(event) {
        return __awaiter(this, void 0, void 0, function* () {
            // ERORROR RESPONSE HERE
            return (0, response_1.ErrorResponse)(404, "request method is not supported !");
        });
    }
    // USER PROFILE
    CreateUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = (0, class_transformer_1.plainToClass)(SignupInput_1.SignupInput, event.body);
                const error = yield (0, errors_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(404, error);
                const Salt = yield (0, password_1.GetSalt)();
                const hashedPassword = yield (0, password_1.GetHashedPassword)(input.password, Salt.toString());
                const data = yield this.repository.CreateAccount(input.email.toString(), hashedPassword, Salt.toString(), input.phone, "BUYER");
                return (0, response_1.SusccessResponse)(data);
            }
            catch (error) {
                (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    LoginUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = (0, class_transformer_1.plainToClass)(SignupInput_1.SignupInput, event.body);
                const error = yield (0, errors_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(404, error);
                // const Salt =  await GetSalt();
                // const hashedPassword = await GetHashedPassword(input.password, Salt.toString());
                const data = yield this.repository.FindAccount(input.email);
                const verified = yield (0, password_1.ValidatePassword)(input.password, data.password, data.salt);
                // Check / Validate user password
                if (!verified) {
                    throw new Error("Password does not match");
                }
                const token = yield (0, password_1.GetToken)(data);
                return (0, response_1.SusccessResponse)({ token });
            }
            catch (error) {
                (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    // USER AUTHENTICATION
    GetVerificationToken(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = event.headers.authorization;
            const payload = yield (0, password_1.verifyToken)(token);
            if (payload) {
                const { code, expiry } = (0, notification_1.GenerateAccessCode)();
                // Save on DB  to confirm verification.
                yield this.repository.UpdateVerificationCode(payload.user_id, code, expiry);
                // const response = await SendVerificationCode(code, payload.phone)
                return (0, response_1.SusccessResponse)({
                    message: "verification code is sent to your registered mobile number!",
                });
            }
        });
    }
    VerifyUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = event.headers.authorization;
            const payload = yield (0, password_1.verifyToken)(token);
            if (!payload)
                return (0, response_1.ErrorResponse)(404, "Authorization failed");
            const input = (0, class_transformer_1.plainToClass)(UpdateInput_1.VerificationInput, event.body);
            const error = yield (0, errors_1.AppValidationError)(input);
            if (error)
                return (0, response_1.ErrorResponse)(404, error);
            const { verification_code, expiry_date } = yield this.repository.FindAccount(payload.email.toString());
            // Find user Account
            if (verification_code.toString() === input.code) {
                // Check expiry date
                const currentTime = new Date();
                const diff = (0, dateHelper_1.TimeDifference)(expiry_date, currentTime.toISOString(), "m");
                if (diff > 0) {
                    yield this.repository.UpdateVerifyUser(payload.user_id);
                    return (0, response_1.SusccessResponse)({ message: "user verified !" });
                }
                else {
                    return (0, response_1.ErrorResponse)(403, "verification code expired !");
                }
                // Update DB
            }
            return (0, response_1.SusccessResponse)({ message: "user verified !" });
        });
    }
    // USER PROFILE
    CreateProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = (0, class_transformer_1.plainToClass)(AddressInput_1.ProfileInput, event.body);
                const error = yield (0, errors_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(404, error);
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                // DB Operation
                const result = yield this.repository.CreateProfile(payload.user_id, input);
                return (0, response_1.SusccessResponse)({ message: "Success User profile created" });
            }
            catch (error) {
                (0, response_1.ErrorResponse)(403, error);
            }
        });
    }
    GetProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                // DB Operation
                const result = yield this.repository.GetProfile(payload.user_id);
                return (0, response_1.SusccessResponse)(result);
            }
            catch (error) {
                (0, response_1.ErrorResponse)(403, error);
            }
        });
    }
    EditProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = (0, class_transformer_1.plainToClass)(AddressInput_1.ProfileInput, event.body);
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                // DB Operation
                yield this.repository.EditProfile(payload.user_id, input);
                return (0, response_1.SusccessResponse)({ message: "Success User profile updated" });
            }
            catch (error) {
                (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    // PAYMENT TRANSACTION
    CreatePayment(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SusccessResponse)({ message: "response from create payment" });
        });
    }
    GetPayment(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SusccessResponse)({ message: "response from get Cart" });
        });
    }
    EditPayment(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SusccessResponse)({ message: "response from edit Cart" });
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [userRepositiry_1.UserRepository])
], UserService);
//# sourceMappingURL=userService.js.map