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
exports.ShoppingService = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const line_items_input_1 = require("../models/dto/line-items-input");
const errors_1 = require("../utility/errors");
const password_1 = require("../utility/password");
const response_1 = require("../utility/response");
const class_transformer_1 = require("class-transformer");
class ShoppingService {
    constructor(repository) {
        this.repository = repository;
    }
    ResonseWithError(event) {
        return __awaiter(this, void 0, void 0, function* () {
            // ERORROR RESPONSE HERE
            return (0, response_1.ErrorResponse)(404, "request method is not supported !");
        });
    }
    // ===================================================================
    // CHECH OUT
    // ===================================================================
    checkout(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = event.headers.authorization;
            const payload = yield (0, password_1.verifyToken)(token);
            // Get cart Items
            if (!payload)
                return (0, response_1.ErrorResponse)(404, "Authorization failed");
            const cartItems = yield this.repository.findCartItems(payload.user_id);
            const input = (0, class_transformer_1.plainToClass)(line_items_input_1.LineItemsInput, event.body);
            const error = yield (0, errors_1.AppValidationError)(input);
            if (error)
                return (0, response_1.ErrorResponse)(404, error);
            // Get cart items
            // Get cart total
            // Get cart tax
            // Initialize Payment Gateway
            // Authenticate/Authorize Payment confirmation
            // Send SNS topic To create order [Transaction microservice] => email to user
            const params = {
                Message: JSON.stringify(cartItems),
                TopicArn: process.env.SNSN_TOPIC,
                MessageAttributes: {
                    actionType: {
                        DataType: "string",
                        StringValue: "place_order",
                    },
                },
            };
            const sns = new aws_sdk_1.default.SNS();
            const response = yield sns.publish(params).promise();
            //send tentative Message to user
            return (0, response_1.SusccessResponse)({ msg: "Payment processing . . . .", response });
        });
    }
    refund() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.ShoppingService = ShoppingService;
//# sourceMappingURL=shopping-service.js.map