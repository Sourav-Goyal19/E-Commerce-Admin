import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { CustomerModel } from "@/models/customer.model";
import SendSMS from "@/helpers/sms";

Connect();

export async function POST(req: NextRequest) {
  try {
    // console.log("Calling");
    const reqBody = await req.json();
    const { phone } = reqBody;
    const customer = await CustomerModel.findOne({ phone });
    // console.log("User", user);
    if (!customer) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    if (customer.isVerified) {
      return NextResponse.json(
        { message: "User already verified" },
        { status: 400 }
      );
    }

    const smsResponse = await SendSMS({
      phone_number: phone,
      smsType: "VERIFY",
      customerId: customer._id,
    });

    // console.log("MailResponse", mailResponse);

    return NextResponse.json({ message: "OTP sent" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
