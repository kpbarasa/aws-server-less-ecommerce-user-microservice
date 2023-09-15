import aws from "aws-sdk";
import { LineItemsInput } from "app/models/dto/line-items-input";
import { AppValidationError } from "app/utility/errors";
import { verifyToken } from "app/utility/password";
import { ErrorResponse, SusccessResponse } from "app/utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { CartRepository } from "app/repository/cartRepositiry";

export class ShoppingService {

    repository: CartRepository;

    constructor(repository: CartRepository) {
        this.repository = repository;
    }
    
    async ResonseWithError(event: APIGatewayProxyEventV2) { // ERORROR RESPONSE HERE 
        return ErrorResponse(404, "request method is not supported !");
    };

    async checkout(event: APIGatewayProxyEventV2) {

        const token = event.headers.authorization;
        const payload = await verifyToken(token);

        // Get cart Items
        if (!payload) return ErrorResponse(404, "Authorization failed");
        const cartItems = await this.repository.findCartItems(payload.user_id)

        const input = plainToClass(LineItemsInput, event.body);
        const error = await AppValidationError(input);
        if (error) return ErrorResponse(404, error);

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
        }

        const sns = new aws.SNS();
        const response = await sns.publish(params).promise();

        //send tentative Message to user

        return SusccessResponse({ msg: "Payment processing . . . .", response });
    }

    async refund() { }

}