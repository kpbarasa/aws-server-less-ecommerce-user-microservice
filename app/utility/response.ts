import { Message } from "twilio/lib/twiml/MessagingResponse";

const formatResponse = (statusCode: number, message: string, data: unknown) => {

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

}

export const SusccessResponse = (data: object) => {
    return formatResponse(200, "success", data);
}

export const ErrorResponse = (code = 1000, error: any) => {
    
    if (Array.isArray(error)) {
        const errorObject = error[0].constraints;
        const errorMessage = errorObject[Object.keys(errorObject)[0]] || "Error Occured"
        return formatResponse(code, errorMessage, errorMessage)
    }
    console.log({error});
    console.log(error);
    return formatResponse(code, error, error)
}