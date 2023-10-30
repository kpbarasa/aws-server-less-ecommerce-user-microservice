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
exports.CartService = void 0;
const tsyringe_1 = require("tsyringe");
const message_queue_1 = require("../message-queue");
const class_transformer_1 = require("class-transformer");
const cartInput_1 = require("../models/dto/cartInput");
const errors_1 = require("../utility/errors");
const password_1 = require("../utility/password");
const cartRepositiry_1 = require("../repository/cartRepositiry");
const response_1 = require("../utility/response");
const payment_1 = require("../utility/payment");
const userRepositiry_1 = require("../repository/userRepositiry");
let CartService = class CartService {
    constructor(cartRepository, userRepository) {
        this._cartRepository = cartRepository;
        this._userRepository = userRepository;
    }
    ResonseWithError(event) {
        return __awaiter(this, void 0, void 0, function* () {
            // ERORROR RESPONSE HERE
            return (0, response_1.ErrorResponse)(404, "request method is not supported !");
        });
    }
    // ===================================================================
    // AUTHENTICATE USER
    // Validate user
    // Validate form inputs
    // CHECK IF USER SHOPPING CARTS EXISTS
    // IF: user shopping cart exists gFind cart
    // ELSE: CREATE NEW USER CART
    // CHECK IF USER SHOPPING CARTS ITEMS
    // DB PROCESS: Find use cart items by ID
    // ADD ITEMS TO NEW CART
    // Get cart item product information  from  product service
    // Uptdate cart item properties
    // DB PROCESS: Create cart
    // DB PROCESS: GET cart
    // DB PROCESS: GET cart items
    // DB PROCESS: UPDATE cart
    // ===================================================================
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
                // ===================================================================
                // CHECK IF USER SHOPPING CARTS EXISTS
                // IF: user shopping cart exists gFind cart
                // ELSE: CREATE NEW USER CART
                // ===================================================================
                let currentCart = yield this._cartRepository.findShoppingCart(payload.user_id);
                if (!currentCart)
                    currentCart = yield this._cartRepository.createShoppingCart(payload.user_id);
                // ===================================================================
                // CHECK IF USER SHOPPING CARTS ITEMS
                // DB PROCESS: Find use cart items by ID
                // ===================================================================
                let GetCartItem = yield this._cartRepository.findCartItem(currentCart.cart_id, input.productId);
                if (GetCartItem) {
                    // ===================================================================
                    // UPDATE AND ADD ITEMS TO EXISTING CART
                    // Uptdate cart item properties
                    // DB PROCESS: Update cart item by product ID
                    // ===================================================================
                    // Uptdate cart item properties
                    input.quantity = input.quantity + GetCartItem.quantity; //Update item Quantity
                    let itemTotal = input.quantity * GetCartItem.price;
                    input.subtotal = itemTotal; //Update item Sub total
                    input.total_tax = itemTotal; //Update item Total + tax
                    input.total = itemTotal; //Update item Total + tax - discounts
                    // DB PROCESS: Update cart item by product ID
                    const result = yield this._cartRepository.updateCartItemByProductId(input);
                    if (!result)
                        (0, response_1.ErrorResponse)(500, "Unable to update Cart Item");
                    return (0, response_1.SusccessResponse)({
                        message: "Shopping cart updated",
                        cartItem: input,
                    });
                }
                else {
                    // ===================================================================
                    // ADD ITEMS TO NEW CART
                    // Get cart item product information  from  product service
                    // Uptdate cart item properties
                    // DB PROCESS: Create cart
                    // DB PROCESS: GET cart
                    // DB PROCESS: GET cart items
                    // DB PROCESS: UPDATE cart
                    // ===================================================================
                    // Get cart item product information  from  product service
                    const requestData = {
                        productId: input.productId,
                        action: "GET PRODUCT",
                    };
                    const { data, status } = yield (0, message_queue_1.PullData)(requestData);
                    if (!data)
                        (0, response_1.ErrorResponse)(500, "Sorry could not get products.");
                    // Uptdate cart item properties
                    let cartItem = data;
                    let itemTotal = input.quantity * cartItem.data.price;
                    cartItem.cart_id = currentCart.cart_id; // Set cart ID
                    cartItem.quantity = input.quantity; // Set cart Item Quantity
                    cartItem.subtotal = itemTotal; // cart  item ttotl cost
                    cartItem.total_tax = itemTotal; // cart  item total cost after Tax
                    cartItem.total = itemTotal; // cart  item total cost after Tax
                    // DB PROCESS: Create cart item
                    const createCart = yield this._cartRepository.createCartItem(cartItem);
                    if (createCart) {
                        return (0, response_1.SusccessResponse)({
                            message: "Success Shopping Cart  created",
                            cartItem: cartItem,
                        });
                    }
                    (0, response_1.ErrorResponse)(500, "Sorry could not create ShoppingCart");
                }
            }
            catch (error) {
                (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    // ===================================================================
    // AUTHENTICATE USER
    // Validate user
    // DB PROCESS: Find use cart items by User ID
    // DB PROCESS: Find use cart items by Cart ID
    // ===================================================================
    GetShoppingCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // ===================================================================
                // AUTHENTICATE USER
                // Validate user
                // DB PROCESS: Find use cart items by User ID
                // DB PROCESS: Find use cart items by Cart ID
                // ===================================================================
                // Validate user
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                // DB PROCESS: Find use cart items by ID
                const getCart = yield this._cartRepository.findShoppingCart(payload.user_id);
                // DB PROCESS: Find use cart items by ID
                const cartItems = yield this._cartRepository.findCartItems(getCart.cart_id);
                const appFee = (0, payment_1.APPLICATION_FEE)(getCart) + (0, payment_1.STRIPE_FEE)(getCart);
                return (0, response_1.SusccessResponse)({
                    "Message": "Success",
                    "Cart": getCart,
                    "App fee": appFee,
                    "Cart items": cartItems
                });
            }
            catch (error) {
                return (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    // ===================================================================
    // AUTHENTICATE USER
    // Validate user
    // Validate form inputs
    // DB PROCESS: Find use cart items by User ID
    // Uptdate cart item properties
    // Calculate application fee
    // DB PROCESS: Find use cart items by Cart Item ID
    // DB PROCESS: Update cart item by product ID
    // DB PROCESS: Update shopping cart
    // DB PROCESS: Find cart items
    // ===================================================================
    EditCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // ===================================================================
                // AUTHENTICATE USER
                // Validate user
                // Validate form inputs
                // DB PROCESS: Find use cart items by User ID
                // Uptdate cart item properties
                // Calculate application fee
                // DB PROCESS: Find use cart items by Cart Item ID
                // DB PROCESS: Update cart item by product ID
                // DB PROCESS: Update shopping cart
                // DB PROCESS: Find cart items
                // ===================================================================
                // Validate user
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                const productId = event.pathParameters.id;
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                // Validate form inputs
                const input = (0, class_transformer_1.plainToClass)(cartInput_1.CartInput, event.body);
                const error = yield (0, errors_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(404, error);
                // ===================================================================
                // CHECK IF USER SHOPPING CARTS EXISTS
                // IF: user shopping cart exists gFind cart
                // ELSE: CREATE NEW USER CART
                // ===================================================================
                let currentCart = yield this._cartRepository.findShoppingCart(payload.user_id);
                if (currentCart) {
                    // ===================================================================
                    // CHECK IF USER SHOPPING CARTS ITEMS
                    // DB PROCESS: Find use cart items by ID
                    // ===================================================================
                    let GetCartItem = yield this._cartRepository.findCartItem(currentCart.cart_id, input.productId);
                    if (!GetCartItem)
                        (0, response_1.ErrorResponse)(404, new Error("Cartitem does not exists"));
                    // ===================================================================
                    // UPDATE AND ADD ITEMS TO EXISTING CART
                    // Uptdate cart item properties
                    // Calculate application fee
                    // DB PROCESS: Update shopping cart
                    // DB PROCESS: Update cart item by product ID
                    // DB PROCESS: Find cart items
                    // DB PROCESS: Update cart item by product ID
                    // ===================================================================
                    // Uptdate cart item properties
                    input.quantity = input.quantity + GetCartItem.quantity; //Update item Quantity
                    let itemTotal = input.quantity * GetCartItem.price;
                    input.subtotal = itemTotal; //Update item Sub total
                    input.total_tax = itemTotal; //Update item Total + tax
                    input.total = itemTotal; //Update item Total + tax - discounts
                    // DB PROCESS: Update cart item by product ID
                    const result = yield this._cartRepository.updateCartItemByProductId(input);
                    if (!result)
                        (0, response_1.ErrorResponse)(500, new Error("Unable to update Cart Item"));
                    // DB PROCESS: Find cart items
                    const cartItems = yield this._cartRepository.findCartItems(currentCart.cart_id);
                    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    let updateInput = currentCart;
                    updateInput.total_tax = 100;
                    updateInput.subtotal = totalAmount;
                    updateInput.total = totalAmount + updateInput.total_tax;
                    // DB PROCESS: Update shopping cart
                    const cartRes = yield this._cartRepository.updateShoppingCart(updateInput);
                    // Calculate application fee
                    const appFee = (0, payment_1.APPLICATION_FEE)(updateInput) + (0, payment_1.STRIPE_FEE)(updateInput);
                    return (0, response_1.SusccessResponse)({
                        "Message": "Success",
                        "Cart": cartRes,
                        "App Fee": appFee,
                        "Cart items": cartItems
                    });
                }
                throw new Error("Cart does not exists");
            }
            catch (error) {
                return (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    // ===================================================================
    // AUTHENTICATE USER
    // Validate users
    // DB PROCESS: DELETE cart by Cart ID
    // CHECK IF USER SHOPPING CART EXISTS
    // DB OPERATION: Find shopping cart
    // CHECK IF USER SHOPPING CART ITEM EXISTS
    // DB OPERATION: Find shopping cart item
    // ===================================================================
    DeleteCartItem(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate user
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                // ===================================================================
                // CHECK IF USER SHOPPING CART EXISTS
                // DB OPERATION: Find shopping cart
                // ===================================================================
                let currentCart = yield this._cartRepository.findShoppingCart(payload.user_id);
                if (!currentCart)
                    throw (0, response_1.ErrorResponse)(404, "Sorry could not find cart.");
                const producId = event.pathParameters.id;
                // ===================================================================
                // CHECK IF USER SHOPPING CART ITEM EXISTS
                // DB OPERATION: Find shopping cart item
                // ===================================================================
                let currentCartItem = (yield this._cartRepository.findCartItem(currentCart.cart_id, producId));
                if (!currentCartItem)
                    throw (0, response_1.ErrorResponse)(404, "Sorry could not find cart item.");
                const result = yield this._cartRepository.deleteCartItem(currentCart.cart_id, producId);
                if (result) {
                    return (0, response_1.SusccessResponse)({ message: "Shopping cart deleted" });
                }
                (0, response_1.ErrorResponse)(500, "Unable to Delete Cart Item");
            }
            catch (error) {
                return (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    // ===================================================================
    // AUTHENTICATE USER
    // Validate users
    // DB PROCESS: DELETE cart by Cart ID
    // CHECK IF USER SHOPPING CART EXISTS
    // DB OPERATION: Find shopping cart
    // ===================================================================
    DeleteCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate user
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(404, "Authorization failed");
                // ===================================================================
                // CHECK IF USER SHOPPING CART EXISTS
                // DB OPERATION: Find shopping cart
                // ===================================================================
                let currentCart = yield this._cartRepository.findShoppingCart(payload.user_id);
                if (!currentCart)
                    throw (0, response_1.ErrorResponse)(404, "Sorry could not find cart.");
                console.log({ currentCart });
                const result = yield this._cartRepository.deleteCart(currentCart.cart_id, payload.user_id);
                if (result) {
                    return (0, response_1.SusccessResponse)({ message: "Shopping cart deleted" });
                }
                (0, response_1.ErrorResponse)(500, "Unable to update Cart Item");
            }
            catch (error) {
                return (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    // ===================================================================
    // DB OPERATION: Get user profile
    // DB OPERATION: Find shopping cart
    // Calculate application fee
    // initilize Payment gateway
    // DB OPERATION: Find shopping cart
    // ===================================================================
    CollectPayment(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.verifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(403, "authorization failed!");
                // DB OPERATION: Get user profile
                const { stripe_id, email, phone } = yield new userRepositiry_1.UserRepository().GetProfile(payload.user_id);
                // DB OPERATION: Find shopping cart
                const cart = yield this._cartRepository.findShoppingCart(payload.user_id);
                // Calculate application fee
                const appFee = (0, payment_1.APPLICATION_FEE)(cart);
                const stripeFee = (0, payment_1.STRIPE_FEE)(cart);
                const amount = cart.total + appFee + stripeFee;
                // initilize Payment gateway
                const { secret, publishableKey, customerId, paymentId } = yield (0, payment_1.CreatePaymentSession)({
                    amount,
                    email,
                    phone,
                    customerId: stripe_id,
                });
                // DB OPERATION: Find shopping cart
                yield new userRepositiry_1.UserRepository().updateUserPayment(payload.user_id, customerId, paymentId);
                return (0, response_1.SusccessResponse)({ secret, publishableKey });
            }
            catch (error) {
                return (0, response_1.ErrorResponse)(500, error);
            }
        });
    }
    // ===================================================================
    // DB OPERATION: Get user profile
    // DB OPERATION: Find shopping cart
    // Calculate application fee
    // initilize Payment gateway
    // DB OPERATION: Find shopping cart
    // ===================================================================
    PlaceOrder(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = event.headers.authorization;
            const payload = yield (0, password_1.verifyToken)(token);
            if (!payload)
                return (0, response_1.ErrorResponse)(403, "authorization failed!");
            const { payment_id } = yield new userRepositiry_1.UserRepository().GetProfile(payload.user_id);
            const paymentInfo = yield (0, payment_1.RetrivePayment)(payment_id);
            if (paymentInfo.status === "succeeded") {
                // const cartItems = await this._cartRepository.findCartItems(payload.user_id);
                // // Send SNS topic to create Order [Transaction MS] => email to user
                // const params = {
                //   Message: JSON.stringify(cartItems),
                //   TopicArn: process.env.SNS_TOPIC,
                //   MessageAttributes: {
                //     actionType: {
                //       DataType: "String",
                //       StringValue: "place_order",
                //     },
                //   },
                // };
                // const sns = new aws.SNS();
                // const response = await sns.publish(params).promise();
                // console.log(response);
                return (0, response_1.SusccessResponse)({ msg: "success", paymentInfo });
            }
            return (0, response_1.ErrorResponse)(503, new Error("payment failed!"));
        });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [cartRepositiry_1.CartRepository, userRepositiry_1.UserRepository])
], CartService);
//# sourceMappingURL=cartService.js.map