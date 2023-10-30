import middy from "@middy/core";
import { container } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import middyBodyParser from "@middy/http-json-body-parser";
import { CartService, UserService } from "../services";

const cartService = container.resolve(CartService);

export const CollectPayment = middy((event: APIGatewayProxyEventV2) => {
    return cartService.CollectPayment(event);
}).use(middyBodyParser())

export const PlaceOrder = middy((event: APIGatewayProxyEventV2) => {
  return cartService.PlaceOrder(event);
}).use(middyBodyParser());

  