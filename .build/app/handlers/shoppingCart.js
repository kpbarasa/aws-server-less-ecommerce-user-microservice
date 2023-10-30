"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const core_1 = __importDefault(require("@middy/core"));
const tsyringe_1 = require("tsyringe");
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const services_1 = require("../services");
const service = tsyringe_1.container.resolve(services_1.UserService);
const cartService = tsyringe_1.container.resolve(services_1.CartService);
exports.Cart = (0, core_1.default)((event) => {
    const httpMethod = event.requestContext.http.method;
    const httpPath = event.requestContext.http.path;
    const httpPathDir = httpPath.split("/");
    if (httpMethod === "POST") {
        return cartService.CreateCart(event);
    }
    else if (httpMethod === "GET") {
        return cartService.GetShoppingCart(event);
    }
    else if (httpMethod === "PUT") {
        return cartService.EditCart(event);
    }
    else if (httpMethod === "DELETE") {
        if (httpPathDir[2] === "item") {
            return cartService.DeleteCartItem(event);
        }
        return cartService.DeleteCart(event);
    }
    else {
        return cartService.ResonseWithError(event);
    }
}).use((0, http_json_body_parser_1.default)());
//# sourceMappingURL=shoppingCart.js.map