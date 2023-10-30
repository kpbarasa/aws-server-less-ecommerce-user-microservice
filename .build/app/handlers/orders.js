"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const core_1 = __importDefault(require("@middy/core"));
const tsyringe_1 = require("tsyringe");
const userService_1 = require("../services/userService");
const cartService_1 = require("../services/cartService");
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const service = tsyringe_1.container.resolve(userService_1.UserService);
const cartService = tsyringe_1.container.resolve(cartService_1.CartService);
exports.Orders = (0, core_1.default)((event) => {
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
//# sourceMappingURL=orders.js.map