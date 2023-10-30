import aws from "aws-sdk";
import { autoInjectable } from "tsyringe";
import { PullData } from "../message-queue";
import { plainToClass } from "class-transformer";
import { CartInput } from "../models/dto/cartInput";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { AppValidationError } from "../utility/errors";
import { verifyToken } from "../utility/password";
import { CartRepository } from "../repository/cartRepositiry";
import { SusccessResponse, ErrorResponse } from "../utility/response";
import {
  ShoppingCartItemModel,
  ShoppingCartItemsInputs,
  ShoppingCartModel,
} from "../models/CartItemsModel";

import {
  APPLICATION_FEE,
  CreatePaymentSession,
  RetrivePayment,
  STRIPE_FEE,
} from "../utility/payment"
import { UserRepository } from "../repository/userRepositiry";
import { CallSummaryContextImpl } from "twilio/lib/rest/insights/v1/call/callSummary";

@autoInjectable()
export class CartService {
  _cartRepository: CartRepository;
  _userRepository: UserRepository;

  constructor(cartRepository: CartRepository, userRepository: UserRepository) {
    this._cartRepository = cartRepository;
    this._userRepository = userRepository;
  }

  async ResonseWithError(event: APIGatewayProxyEventV2) {
    // ERORROR RESPONSE HERE
    return ErrorResponse(404, "request method is not supported !");
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
  async CreateCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(404, "Authorization failed");

      const input = plainToClass(CartInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      // ===================================================================
      // CHECK IF USER SHOPPING CARTS EXISTS
      // IF: user shopping cart exists gFind cart
      // ELSE: CREATE NEW USER CART
      // ===================================================================
      let currentCart = await this._cartRepository.findShoppingCart(
        payload.user_id
      );
      if (!currentCart)
        currentCart = await this._cartRepository.createShoppingCart(
          payload.user_id
        );

      // ===================================================================
      // CHECK IF USER SHOPPING CARTS ITEMS
      // DB PROCESS: Find use cart items by ID
      // ===================================================================
      let GetCartItem = await this._cartRepository.findCartItem(
        currentCart.cart_id,
        input.productId
      );

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
        const result = await this._cartRepository.updateCartItemByProductId(
          input
        );

        if (!result) ErrorResponse(500, "Unable to update Cart Item");

        return SusccessResponse({
          message: "Shopping cart updated",
          cartItem: input,
        });
      } else {
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
        const { data, status } = await PullData(requestData);
        if (!data) ErrorResponse(500, "Sorry could not get products.");

        // Uptdate cart item properties
        let cartItem = data as ShoppingCartItemsInputs;
        let itemTotal = input.quantity * cartItem.data.price;
        cartItem.cart_id = currentCart.cart_id; // Set cart ID
        cartItem.quantity = input.quantity; // Set cart Item Quantity
        cartItem.subtotal = itemTotal; // cart  item ttotl cost
        cartItem.total_tax = itemTotal; // cart  item total cost after Tax
        cartItem.total = itemTotal; // cart  item total cost after Tax

        // DB PROCESS: Create cart item
        const createCart = await this._cartRepository.createCartItem(cartItem);

        if (createCart) {
          return SusccessResponse({
            message: "Success Shopping Cart  created",
            cartItem: cartItem,
          });
        }

        ErrorResponse(500, "Sorry could not create ShoppingCart");
      }
    } catch (error) {
      ErrorResponse(500, error);
    }
  }

  // ===================================================================
  // AUTHENTICATE USER
  // Validate user
  // DB PROCESS: Find use cart items by User ID
  // DB PROCESS: Find use cart items by Cart ID
  // ===================================================================
  async GetShoppingCart(event: APIGatewayProxyEventV2) {
    try {
      // ===================================================================
      // AUTHENTICATE USER
      // Validate user
      // DB PROCESS: Find use cart items by User ID
      // DB PROCESS: Find use cart items by Cart ID
      // ===================================================================
      // Validate user
      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(404, "Authorization failed");

      // DB PROCESS: Find use cart items by ID
      const getCart = await this._cartRepository.findShoppingCart(
        payload.user_id
      );

      // DB PROCESS: Find use cart items by ID
      const cartItems = await this._cartRepository.findCartItems(
        getCart.cart_id
      );

      const appFee = APPLICATION_FEE(getCart) + STRIPE_FEE(getCart);

      return SusccessResponse({
        "Message": "Success",
        "Cart":getCart,
        "App fee":appFee,
        "Cart items":cartItems
      });

    } catch (error) {
      return ErrorResponse(500, error);
    }
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
  async EditCart(event: APIGatewayProxyEventV2) {
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
      const payload = await verifyToken(token);
      const productId = event.pathParameters.id;
      if (!payload) return ErrorResponse(404, "Authorization failed");

      // Validate form inputs
      const input = plainToClass(CartInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);
      

      // ===================================================================
      // CHECK IF USER SHOPPING CARTS EXISTS
      // IF: user shopping cart exists gFind cart
      // ELSE: CREATE NEW USER CART
      // ===================================================================
      let currentCart = await this._cartRepository.findShoppingCart(
        payload.user_id
      );

      if (currentCart) {
        // ===================================================================
        // CHECK IF USER SHOPPING CARTS ITEMS
        // DB PROCESS: Find use cart items by ID
        // ===================================================================
        let GetCartItem = await this._cartRepository.findCartItem(
          currentCart.cart_id,
          input.productId
        );

        if (!GetCartItem)
          ErrorResponse(404, new Error("Cartitem does not exists"));

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
        const result = await this._cartRepository.updateCartItemByProductId(
          input
        );

        if (!result)
          ErrorResponse(500, new Error("Unable to update Cart Item"));

        // DB PROCESS: Find cart items
        const cartItems = await this._cartRepository.findCartItems(
          currentCart.cart_id
        ) 

        const totalAmount = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        let updateInput = currentCart as ShoppingCartModel;
        updateInput.total_tax = 100;
        updateInput.subtotal = totalAmount;
        updateInput.total = totalAmount + updateInput.total_tax;

        // DB PROCESS: Update shopping cart
        const cartRes = await this._cartRepository.updateShoppingCart(
          updateInput
        );

        // Calculate application fee
        const appFee = APPLICATION_FEE(updateInput) + STRIPE_FEE(updateInput);

        return SusccessResponse({
          "Message": "Success",
          "Cart":cartRes,
          "App Fee":appFee,
          "Cart items":cartItems
        });
      }

      throw new Error("Cart does not exists")

    } catch (error) {
      return ErrorResponse(500, error);
    }
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
  async DeleteCartItem(event: APIGatewayProxyEventV2) {
    try {
      // Validate user
      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(404, "Authorization failed");

      // ===================================================================
      // CHECK IF USER SHOPPING CART EXISTS
      // DB OPERATION: Find shopping cart
      // ===================================================================
      let currentCart = await this._cartRepository.findShoppingCart(
        payload.user_id
      );
      if (!currentCart) throw ErrorResponse(404, "Sorry could not find cart.");

      const producId = event.pathParameters.id;

      // ===================================================================
      // CHECK IF USER SHOPPING CART ITEM EXISTS
      // DB OPERATION: Find shopping cart item
      // ===================================================================
      let currentCartItem = (await this._cartRepository.findCartItem(
        currentCart.cart_id,
        producId
      )) as ShoppingCartItemModel;
      if (!currentCartItem)
        throw ErrorResponse(404, "Sorry could not find cart item.");

      const result = await this._cartRepository.deleteCartItem(
        currentCart.cart_id,
        producId
      );

      if (result) {
        return SusccessResponse({ message: "Shopping cart deleted" });
      }

      ErrorResponse(500, "Unable to Delete Cart Item");
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  // ===================================================================
  // AUTHENTICATE USER
  // Validate users
  // DB PROCESS: DELETE cart by Cart ID

  // CHECK IF USER SHOPPING CART EXISTS
  // DB OPERATION: Find shopping cart
  // ===================================================================
  async DeleteCart(event: APIGatewayProxyEventV2) {
    try {
      // Validate user
      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(404, "Authorization failed");

      // ===================================================================
      // CHECK IF USER SHOPPING CART EXISTS
      // DB OPERATION: Find shopping cart
      // ===================================================================
      let currentCart = await this._cartRepository.findShoppingCart(
        payload.user_id
      );
      if (!currentCart) throw ErrorResponse(404, "Sorry could not find cart.");

      console.log({ currentCart });

      const result = await this._cartRepository.deleteCart(
        currentCart.cart_id,
        payload.user_id
      );

      if (result) {
        return SusccessResponse({ message: "Shopping cart deleted" });
      }

      ErrorResponse(500, "Unable to update Cart Item");
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  // ===================================================================
  // DB OPERATION: Get user profile
  // DB OPERATION: Find shopping cart
  // Calculate application fee
  // initilize Payment gateway
  // DB OPERATION: Find shopping cart
  // ===================================================================
  async CollectPayment(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      // DB OPERATION: Get user profile
      const { stripe_id, email, phone } = await new UserRepository().GetProfile(
        payload.user_id
      );

      // DB OPERATION: Find shopping cart
      const cart = await this._cartRepository.findShoppingCart(payload.user_id);

      // Calculate application fee
      const appFee = APPLICATION_FEE(cart);
      const stripeFee = STRIPE_FEE(cart);
      const amount = cart.total + appFee + stripeFee;

      // initilize Payment gateway
      const { secret, publishableKey, customerId, paymentId } =
        await CreatePaymentSession({
          amount,
          email,
          phone,
          customerId: stripe_id,
        });

      // DB OPERATION: Find shopping cart
      await new UserRepository().updateUserPayment(
        payload.user_id,
        customerId,
        paymentId
      );

      return SusccessResponse({ secret, publishableKey });

    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  
  // ===================================================================
  // DB OPERATION: Get user profile
  // DB OPERATION: Find shopping cart
  // Calculate application fee
  // initilize Payment gateway
  // DB OPERATION: Find shopping cart
  // ===================================================================
  async PlaceOrder(event: APIGatewayProxyEventV2) {

    const token = event.headers.authorization;
    const payload = await verifyToken(token);
    if (!payload) return ErrorResponse(403, "authorization failed!");

    const { payment_id } = await new UserRepository().GetProfile(
      payload.user_id
    );

    const paymentInfo = await RetrivePayment(payment_id);

    if (paymentInfo.status === "succeeded") {
      const cartItems = await this._cartRepository.findCartItems(payload.user_id);

      // Send SNS topic to create Order [Transaction MS] => email to user
      const params = {
        Message: JSON.stringify(cartItems),
        TopicArn: process.env.SNS_TOPIC,
        MessageAttributes: {
          actionType: {
            DataType: "String",
            StringValue: "place_order",
          },
        },
      };
      const sns = new aws.SNS();
      const response = await sns.publish(params).promise();
      console.log(response);
      return SusccessResponse({ msg: "success", paymentInfo });
    }

    return ErrorResponse(503, new Error("payment failed!"));
  }
  
}

