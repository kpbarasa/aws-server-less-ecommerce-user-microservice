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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const response_1 = require("../utility/response");
const tsyringe_1 = require("tsyringe");
const class_transformer_1 = require("class-transformer");
const errors_1 = require("../utility/errors");
const cartRepositiry_1 = require("../repository/cartRepositiry");
const cartInput_1 = require("../models/dto/cartInput");
const message_queue_1 = require("../message-queue");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const password_1 = require("../utility/password");
let CartService = class CartService {
    constructor(repository) {
        this.repository = repository;
    }
    ResonseWithError(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.ErrorResponse)(404, "request method is not supported !");
        });
    }
    ;
    CreateCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                const input = (0, class_transformer_1.plainToClass)(cartInput_1.CartInput, event.body);
                const error = yield (0, errors_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(404, error);
                let currentCart = yield this.repository.findShoppingCart(payload.user_id);
                if (!currentCart)
                    currentCart = (yield this.repository.createShoppingCart(payload.user_id));
                // Find the item if item exists 
                let currentProduct = yield this.repository.findCartItemByProductId(input.productId);
                if (currentProduct) {
                    input.qty = (parseInt(currentProduct.item_qty.toString()) + parseInt(input.qty.toString())),
                        input.subtotal = (input.qty * currentProduct.price).toString(),
                        input.total = input.subtotal;
                    // If exists update the QTY 
                    const result = yield this.repository.updateCartItemByProductId(input.productId, input.qty = (parseInt(currentProduct.item_qty.toString()) + parseInt(input.qty.toString())));
                }
                else {
                    // If does NOt call product service to get product clientInformation
                    const { data, status } = yield (0, message_queue_1.PullData)({
                        action: "GET PRODUCT",
                        productId: input.productId
                    });
                    console.log({ data, status });
                    if (status !== 200) {
                        return (0, response_1.ErrorResponse)(500, "failed to get product data !");
                    }
                    let cartItem = data;
                    console.log({ cartItem });
                    cartItem.cart_id = currentCart.cart_id; // Set cart ID
                    cartItem.item_qty = input.qty; // Set cart Item Quantity
                    cartItem.subtotal = (input.qty * cartItem.price).toString(); // cart  item ttotl cost
                    cartItem.total = cartItem.subtotal; // cart  item total cost after Tax
                    console.log({ cartItem });
                    // Finaly create cart item
                    yield this.repository.createCartItem(cartItem);
                }
                // Return all cart items to client
                const cartItems = yield this.repository.findCartItemsByCartId(currentCart.cart_id);
                console.log({ cartItems });
                if (!cartItems)
                    (0, response_1.ErrorResponse)(500, "failed to get product data !");
                return (0, response_1.SusccessResponse)({ cartItems, message: "Success Shopping cart  created" });
            }
            catch (error) {
                (0, response_1.ErrorResponse)(500, error);
            }
            return (0, response_1.SusccessResponse)({ message: "response from create Cart" });
        });
    }
    ;
    GetCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                const result = yield this.repository.findCartItems(payload.user_id);
                return (0, response_1.SusccessResponse)({ result });
            }
            catch (error) {
                return (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    ;
    EditCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                const cartId = Number(event.pathParameters.id);
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                const input = (0, class_transformer_1.plainToClass)(cartInput_1.CartInput, event.body);
                const error = yield (0, errors_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(404, error);
                const cartItems = yield this.repository.updateCartItemById(cartId, input.qty);
                if (cartItems) {
                    return (0, response_1.SusccessResponse)(cartItems);
                }
                return (0, response_1.ErrorResponse)(404, "Item does not exists");
            }
            catch (error) {
                (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    ;
    DeleteCartItem(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                const result = yield this.repository.deleteCartItem(payload.user_id);
                return (0, response_1.SusccessResponse)({ result });
            }
            catch (error) {
                return (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    ;
    DeleteCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                const result = yield this.repository.deleteCartItem(payload.user_id);
                return (0, response_1.SusccessResponse)({ result });
            }
            catch (error) {
                return (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    ;
    CollectPayment(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                // Initialize Payment Gateway
                // Authenticate/Authorize Payment confirmation
                // Get cart Items
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                const cartItems = yield this.repository.findCartItems(payload.user_id);
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
            }
            catch (error) {
                return (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [cartRepositiry_1.CartRepository])
], CartService);
//# sourceMappingURL=cartService.js.map