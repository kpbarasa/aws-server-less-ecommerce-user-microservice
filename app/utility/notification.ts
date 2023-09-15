import twilio from "twilio";

const accountSid = "AC4e91f87cde0845107cb2e85d71122a99";
const authToken = "2c9f8acc781946df59084dcbfbba8db4";

const client = twilio(accountSid, authToken);

export const GenerateAccessCode = () => {

    const code = Math.floor(10000 + Math.random() * 900000)
    let expiry = new Date();
    // expiry.setTime(new Date().getTime() * 30 * 60 * 1000)
    expiry.setDate(expiry.getDate() + 30); // Set now + 30 days as the new date

    return { code, expiry };

}

export const SendVerificationCode = async (

    code: number,
    toPhoneNumber: string

) => {

    const response = await client.messages.create({
        body: `Your verification code is ${code} it will expire in 30 minutes.`, // SMS Content
        from: "", //Phone Nummber Sending from
        to: toPhoneNumber.trim(), //Phone Nummber Recieving message
    })

    return response;
    
}