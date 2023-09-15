"use strict";
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
exports.UserRepository = void 0;
const databaseClient_1 = require("../utility/databaseClient");
const dbOperations_1 = require("./dbOperations");
class UserRepository extends dbOperations_1.DBOperation {
    constructor() {
        super();
    }
    CreateAccount(email, password, salt, phone, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "INSERT INTO users(phone, email, password, salt, user_type) VALUES($1, $2, $3, $4, $5) RETURNING *";
            const values = [phone, email, password, salt, userType];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
        });
    }
    FindAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "SELECT user_id, phone, email, password, verification_code, expiry_date, salt, user_type FROM users WHERE email = $1";
            const values = [email];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount < 1) {
                throw new Error("User does not exist with provided Email Address");
            }
            return result.rows[0];
        });
    }
    UpdateVerificationCode(userId, code, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated_at = new Date();
            const queryString = "UPDATE users SET verification_code = $1, expiry_date = $2, updated_at = $3 WHERE user_id = $4 AND verified = FALSE RETURNING *";
            const values = [code, expiry, updated_at, userId];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("user already verified !");
        });
    }
    UpdateVerifyUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated_at = new Date();
            const queryString = "UPDATE users SET verified = TRUE WHERE user_id = $1 AND verified = FALSE";
            const values = [userId];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("user already verified !");
        });
    }
    UpdateAccount(email, password, salt, phone, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated_at = new Date();
            const client = yield (0, databaseClient_1.DBClient)();
            yield client.connect();
            const result = yield client.query("UPDATE users SET email = $1, password = $2, salt = $3, phone = $4, updated_at = $5  WHERE user_id = $2", [email, password, salt, phone, updated_at]);
            yield client.end();
            if (result.rowCount > 0) {
                return result.rows[0];
            }
        });
    }
    UpdateUser(userId, firstName, lastName, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "UPDATE users SET first_name = $1, last_name = $2, user_type = $3 WHERE user_id = $4 RETURNING *";
            const values = [firstName, lastName, userType, userId];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("Error updating user !");
        });
    }
    CreateProfile(userId, { firstName, lastName, userType, address: { addressLine1, addressLine2, city, postCode, country }, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkAddress = yield this.GetProfile(userId);
            yield this.UpdateUser(userId, firstName, lastName, userType);
            const queryString = "INSERT INTO address(user_id, address_line1, address_line2, city, post_code, country) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
            const values = [
                userId,
                addressLine1,
                addressLine2,
                city,
                postCode,
                country,
            ];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("Error creating profile !");
        });
    }
    GetProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileQueryString = "SELECT first_name, last_name, email, phone, user_type, verified FROM users where user_id = $1";
            const profileValues = [userId];
            const profileResult = yield this.executeQuery(profileQueryString, profileValues);
            if (profileResult.rowCount < 1) {
                throw new Error("Error User Profile Does Not Exist !");
            }
            const userProfile = profileResult.rows[0];
            const addressQuery = "SELECT id, address_line1, address_line2, city, post_code, country FROM address WHERE user_id = $1";
            const addressValues = [userId];
            const addressResult = yield this.executeQuery(addressQuery, addressValues);
            if (addressResult.rowCount > 0) {
                userProfile.address = addressResult.rows;
            }
            return userProfile;
        });
    }
    EditProfile(userId, { firstName, lastName, userType, address: { addressLine1, addressLine2, city, postCode, country, id }, }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.UpdateUser(userId, firstName, lastName, userType);
            const queryString = "UPDATE address SET address_line1 =$1, address_line2 =$2, city =$3, post_code =$4, country =$5  WHERE id = $6";
            const values = [addressLine1, addressLine2, city, postCode, country, id];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                throw new Error("Error Updating profile !");
            }
            return true;
        });
    }
    ValidateUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield (0, databaseClient_1.DBClient)();
            yield client.connect();
            const result = yield client.query("DELETE FROM users WHERE user_id = $1", [
                userId,
            ]);
            yield client.end();
            if (result.rowCount > 0) {
                return result.rows[0];
            }
        });
    }
    DeleteAccount(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield (0, databaseClient_1.DBClient)();
            yield client.connect();
            const result = yield client.query("DELETE FROM users WHERE user_id = $1", [
                user_id,
            ]);
            yield client.end();
            if (result.rowCount > 0) {
                return result.rows[0];
            }
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepositiry.js.map