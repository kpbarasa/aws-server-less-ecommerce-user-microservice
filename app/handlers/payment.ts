import middy from "@middy/core";
import { container } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import middyBodyParser from "@middy/http-json-body-parser";
import { CartService, UserService } from "../services";

const service = container.resolve(UserService);
const cartService = container.resolve(CartService);

export const Payment = middy((event: APIGatewayProxyEventV2) => {

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

}).use(middyBodyParser());

  