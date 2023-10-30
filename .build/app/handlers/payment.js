"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.CollectPayment = void 0;
const core_1 = __importDefault(require("@middy/core"));
const tsyringe_1 = require("tsyringe");
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const services_1 = require("../services");
const service = tsyringe_1.container.resolve(services_1.UserService);
const cartService = tsyringe_1.container.resolve(services_1.CartService);
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
//# sourceMappingURL=payment.js.map