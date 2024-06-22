import { CustomerModel } from "@/models/customer.model";
import twilio from "twilio";

const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

interface SMSOptions {
  phone_number: string;
  smsType: "VERIFY" | "RESET";
  customerId: any;
}

const generateOTP = (digit: number): string => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i <= digit; i++) {
    let random = Math.round(Math.random() * 9);
    OTP += digits[random];
  }
  return OTP;
};

export default async function SendSMS({
  phone_number,
  smsType,
  customerId,
}: SMSOptions) {
  try {
    let updateFields: any = {};
    const OTP = generateOTP(6);

    if (smsType == "VERIFY") {
      updateFields = {
        verificationCode: OTP,
        verificationCodeExpiry: Date.now() + 3600000,
      };
    } else if (smsType == "RESET") {
      updateFields = {
        forgotPasswordOtp: OTP,
        forgotPasswordOtpExpiry: Date.now() + 3600000,
      };
    }

    await CustomerModel.findByIdAndUpdate(customerId, { $set: updateFields });

    const messageBody = getOtpTemplate(smsType, OTP);

    const messageResponse = await client.messages.create({
      body: messageBody,
      from: twilioPhoneNumber,
      to: phone_number,
    });

    return messageResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

function getOtpTemplate(smsType: "VERIFY" | "RESET", otp: string): string {
  return smsType === "VERIFY"
    ? `Your verification code is ${otp}`
    : `Your password reset code is ${otp}`;
}
