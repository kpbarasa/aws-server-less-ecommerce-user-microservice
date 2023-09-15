"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.CollectPayment = exports.Cart = exports.Profile = exports.Verify = exports.Login = exports.Signup = void 0;
const core_1 = __importDefault(require("@middy/core"));
const tsyringe_1 = require("tsyringe");
const userService_1 = require("../services/userService");
const cartService_1 = require("../services/cartService");
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const service = tsyringe_1.container.resolve(userService_1.UserService);
const cartService = tsyringe_1.container.resolve(cartService_1.CartService);
exports.Signup = (0, core_1.default)((event) => {
    return service.CreateUser(event);
}).use((0, http_json_body_parser_1.default)());
exports.Login = (0, core_1.default)((event) => {
    return service.LoginUser(event);
}).use((0, http_json_body_parser_1.default)());
exports.Verify = (0, core_1.default)((event) => {
    const httpMethod = event.requestContext.http.method;
    if (httpMethod === "POST") {
        return service.VerifyUser(event);
    }
    else if (httpMethod === "GET") {
        return service.GetVerificationToken(event);
    }
    else {
        return service.ResonseWithError(event);
    }
}).use((0, http_json_body_parser_1.default)());
exports.Profile = (0, core_1.default)((event) => {
    const httpMethod = event.requestContext.http.method;
    if (httpMethod === "POST") {
        return service.CreateProfile(event);
    }
    else if (httpMethod === "GET") {
        return service.GetProfile(event);
    }
    else if (httpMethod === "PUT") {
        return service.EditProfile(event);
    }
    else {
        return service.ResonseWithError(event);
    }
}).use((0, http_json_body_parser_1.default)());
exports.Cart = (0, core_1.default)((event) => {
    const httpMethod = event.requestContext.http.method;
    if (httpMethod === "POST") {
        return cartService.CreateCart(event);
    }
    else if (httpMethod === "GET") {
        return cartService.GetCart(event);
    }
    else if (httpMethod === "PUT") {
        return cartService.EditCart(event);
    }
    else if (httpMethod === "DELETE") {
        return cartService.DeleteCart(event);
    }
    else {
        return cartService.ResonseWithError(event);
    }
}).use((0, http_json_body_parser_1.default)());
exports.CollectPayment = (0, core_1.default)((event) => {
    return cartService.CollectPayment(event);
}).use((0, http_json_body_parser_1.default)());
exports.Payment = (0, core_1.default)((event) => {
    const httpMethod = event.requestContext.http.method;
    if (httpMethod === "post") {
        return service.CreatePayment(event);
    }
    else if (httpMethod === "get") {
        return service.GetPayment(event);
    }
    else if (httpMethod === "put") {
        return service.EditPayment(event);
    }
    else {
        return service.ResonseWithError(event);
    }
}).use((0, http_json_body_parser_1.default)());
//# sourceMappingURL=userHandler.js.map