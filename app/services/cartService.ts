import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SusccessResponse, ErrorResponse } from "../utility/response"
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";
import { CartRepository } from "../repository/cartRepositiry";
import { CartInput } from "../models/dto/cartInput";
import { ShoppingCartItemModel } from "../models/CartItemsModel";
import { PullData } from "../message-queue";
import aws from "aws-sdk";
import { verifyToken } from "../utility/password";
import { v4 as uuidv4 } from 'uuid';

interface lineItems {
    // CART ITEMS
     id:  string,
     name: string,	//Fee name.
     tax_class: string,	//Tax class of fee.
     tax_status: string,	//Tax status of fee. Options: taxable and none.
     total: string,	//Line total (after discounts).
     total_tax: string,	//Line total tax (after discounts).READ-ONLY
     taxes: string[],	//Line taxes. See Order - Taxes propertiesREAD-ONLY
     meta_data: string[]	//Meta data. See Order - Meta data properties
}

interface orderObject {
    cartItems: CartInput,
    cart: lineItems
}

@autoInjectable()

export class CartService {

    repository: CartRepository;

    constructor(repository: CartRepository) {
        this.repository = repository;
    }

    async ResonseWithError(event: APIGatewayProxyEventV2) { // ERORROR RESPONSE HERE 
        return ErrorResponse(404, "request method is not supported !");
    };


    async CreateCart(event: APIGatewayProxyEventV2) {

        try {

            const token = event.headers.authorization;
            const payload = await verifyToken(token);
            if (!payload) return ErrorResponse(404, "Authorization failed");
            

            const input = plainToClass(CartInput, event.body);

            const error = await AppValidationError(input);
            if (error) return ErrorResponse(404, error);


            let currentCart = await this.repository.findShoppingCart(payload.user_id);
            if (!currentCart) currentCart = await this.repository.createShoppingCart(payload.user_id) as ShoppingCartItemModel;

            // Find the item if item exists 
            let currentProduct = await this.repository.findCartItemByProductId(input.productId);
            
            if (currentProduct) {

                input.qty = (parseInt(currentProduct.item_qty.toString()) + parseInt(input.qty.toString())),
                input.subtotal = (input.qty * currentProduct.price ).toString(),
                input.total = input.subtotal

                // If exists update the QTY 
                const result = await this.repository.updateCartItemByProductId(
                    input.productId,
                    input.qty = (parseInt(currentProduct.item_qty.toString()) + parseInt(input.qty.toString()))
                );
                

            }
            else {

                // If does NOt call product service to get product clientInformation
                const { data, status } = await PullData({
                    action: "GET PRODUCT",
                    productId: input.productId
                });
                

                console.log({data, status});
                if (status !== 200) {
                    return ErrorResponse(500, "failed to get product data !");
                }

                let cartItem = data as ShoppingCartItemModel;
                console.log({cartItem});

                cartItem.cart_id =  currentCart.cart_id; // Set cart ID
                cartItem.item_qty = input.qty; // Set cart Item Quantity
                cartItem.subtotal = (input.qty * cartItem.price ).toString(); // cart  item ttotl cost
                cartItem.total = cartItem.subtotal; // cart  item total cost after Tax
                console.log({cartItem});
                
                // Finaly create cart item
                await this.repository.createCartItem(cartItem);
            }

            // Return all cart items to client
            const cartItems = await this.repository.findCartItemsByCartId(currentCart.cart_id);
            console.log({cartItems});
            
            if(!cartItems) ErrorResponse(500, "failed to get product data !");
            
            return SusccessResponse({ cartItems, message: "Success Shopping cart  created" });

        } catch (error) {
            ErrorResponse(500, error)
        }

        return SusccessResponse({ message: "response from create Cart" })

    };

    async GetCart(event: APIGatewayProxyEventV2) {
        try {

            const token = event.headers.authorization;
            const payload = await verifyToken(token);
            if (!payload) return ErrorResponse(404, "Authorization failed");

            const result = await this.repository.findCartItems(payload.user_id)

            return SusccessResponse({ result });

        } catch (error) {

            return ErrorResponse(500, error);

        }

    };

    async EditCart(event: APIGatewayProxyEventV2) {

        try {

            const token = event.headers.authorization;
            const payload = await verifyToken(token);
            const cartId = Number(event.pathParameters.id);
            if (!payload) return ErrorResponse(404, "Authorization failed");

            const input = plainToClass(CartInput, event.body);
            const error = await AppValidationError(input);
            if (error) return ErrorResponse(404, error);

            const cartItems = await this.repository.updateCartItemById(cartId, input.qty)

            if (cartItems) {

                return SusccessResponse(cartItems)

            }

            return ErrorResponse(404, "Item does not exists");

        } catch (error) {
            ErrorResponse(500, error)
        }

    };

    async DeleteCartItem(event: APIGatewayProxyEventV2) {
        try {

            const token = event.headers.authorization;
            const payload = await verifyToken(token);
            if (!payload) return ErrorResponse(404, "Authorization failed");

            const result = await this.repository.deleteCartItem(payload.user_id)

            return SusccessResponse({ result });

        } catch (error) {

            return ErrorResponse(500, error);

        }
    };

    async DeleteCart(event: APIGatewayProxyEventV2) {
        try {

            const token = event.headers.authorization;
            const payload = await verifyToken(token);
            if (!payload) return ErrorResponse(404, "Authorization failed");

            const result = await this.repository.deleteCartItem(payload.user_id)

            return SusccessResponse({ result });

        } catch (error) {

            return ErrorResponse(500, error);

        }
    };

    async CollectPayment(event: APIGatewayProxyEventV2) {
        try {
            const token = event.headers.authorization;
            const payload = await verifyToken(token);

            // Initialize Payment Gateway

            // Authenticate/Authorize Payment confirmation

            // Get cart Items

            if (!payload) return ErrorResponse(404, "Authorization failed");
            const cartItems = await this.repository.findCartItems(payload.user_id)

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
            }

            const sns = new aws.SNS();
            const response = await sns.publish(params).promise();

            //send tentative Message to user

            return SusccessResponse({ msg: "Payment processing . . . .", response});

        } catch (error) {

            return ErrorResponse(500, error);

        }
    }



}