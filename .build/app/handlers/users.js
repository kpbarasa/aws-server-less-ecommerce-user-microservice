"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = exports.Verify = exports.Login = exports.Signup = void 0;
const core_1 = __importDefault(require("@middy/core"));
const tsyringe_1 = require("tsyringe");
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const services_1 = require("../services");
const service = tsyringe_1.container.resolve(services_1.UserService);
exports.Signup = (0, core_1.default)((event) => {
    return service.CreateUser(event);
}).use((0, http_json_body_parser_1.default)());
exports.Login = (0, core_1.default)((event) => {
    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDdd");
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
//# sourceMappingURL=users.js.map