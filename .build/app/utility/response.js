"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = exports.SusccessResponse = void 0;
const formatResponse = (statusCode, message, data) => {
    if (data) {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message,
                data
            }),
        };
    }
    else {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                message,
            }),
        };
    }
};
const SusccessResponse = (data) => {
    return formatResponse(200, "success", data);
};
exports.SusccessResponse = SusccessResponse;
const ErrorResponse = (code = 1000, error) => {
    if (Array.isArray(error)) {
        const errorObject = error[0].constraints;
        const errorMessage = errorObject[Object.keys(errorObject)[0]] || "Error Occured";
        return formatResponse(code, errorMessage, errorMessage);
    }
    console.log({ error });
    console.log(error);
    return formatResponse(code, error, error);
};
exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=response.js.map