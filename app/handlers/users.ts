import middy from "@middy/core";
import { container } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import middyBodyParser from "@middy/http-json-body-parser";
import { UserService } from "../services";

const service = container.resolve(UserService);

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

  