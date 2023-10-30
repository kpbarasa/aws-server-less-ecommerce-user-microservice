import middy from "@middy/core";
import { container } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import middyBodyParser from "@middy/http-json-body-parser";
import { CartService, UserService } from "../services";

const service = container.resolve(UserService);
const cartService = container.resolve(CartService);

export const Cart = middy((event: APIGatewayProxyEventV2) => {

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

        if (httpPathDir[2] === "item"){
            return cartService.DeleteCartItem(event);
        } 

        return cartService.DeleteCart(event);
    }
    else {
        return cartService.ResonseWithError(event);
    }

}).use(middyBodyParser());