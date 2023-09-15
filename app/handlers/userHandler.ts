import middy from "@middy/core";
import { container } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from '../services/userService';
import { CartService } from '../services/cartService';
import middyBodyParser from "@middy/http-json-body-parser";

const service = container.resolve(UserService);
const cartService = container.resolve(CartService);

export const Signup = middy((event: APIGatewayProxyEventV2) => {

    return service.CreateUser(event);

}).use(middyBodyParser());


export const Login = middy((event: APIGatewayProxyEventV2) => {

    return service.LoginUser(event);

}).use(middyBodyParser());


export const Verify = middy((event: APIGatewayProxyEventV2) => {
    
    const httpMethod = event.requestContext.http.method;    
    
    if (httpMethod === "POST") {
        return service.VerifyUser(event);
    }
    else if (httpMethod === "GET") {
        return service.GetVerificationToken(event);
    }
    else {
        return service.ResonseWithError(event)
    }


}).use(middyBodyParser());


export const Profile = middy((event: APIGatewayProxyEventV2) => {

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

}).use(middyBodyParser());


export const Cart = middy((event: APIGatewayProxyEventV2) => {

    const httpMethod = event.requestContext.http.method;

    if (httpMethod === "POST") {
        return cartService.CreateCart(event);
    }
    else if (httpMethod === "GET") {
        
        return cartService.GetCart(event);
    }
    else if (httpMethod === "PUT") {
        return cartService.EditCart(event);
    }
    else if (httpMethod === "DELETE") {
        return cartService.DeleteCart(event);
    }
    else {
        return cartService.ResonseWithError(event);
    }

}).use(middyBodyParser());

export const CollectPayment = middy((event: APIGatewayProxyEventV2) => {
    return cartService.CollectPayment(event);
}).use(middyBodyParser())

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

  