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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.GetToken = exports.ValidatePassword = exports.GetHashedPassword = exports.GetSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const APP_SECRET = "DA_app_secrete_HEre";
const saltRounds = 10;
const GetSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.genSaltSync(saltRounds);
});
exports.GetSalt = GetSalt;
const GetHashedPassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.hashSync(password, salt);
});
exports.GetHashedPassword = GetHashedPassword;
const ValidatePassword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(enteredPassword, savedPassword, salt);
    return (yield (0, exports.GetHashedPassword)(enteredPassword, salt)) == savedPassword;
});
exports.ValidatePassword = ValidatePassword;
const GetToken = ({ user_id, email, password, salt, phone, userType }) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign({
        user_id,
        email,
        password,
        salt,
        phone,
        userType
    }, APP_SECRET, { expiresIn: "60m" });
});
exports.GetToken = GetToken;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (token !== "") {
            const payload = yield jsonwebtoken_1.default.verify(token.split(' ')[1], APP_SECRET);
            return payload;
        }
        return false;
    }
    catch (error) {
        return false;
    }
});
exports.verifyToken = verifyToken;
//# sourceMappingURL=password.js.map