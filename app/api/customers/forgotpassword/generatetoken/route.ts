import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { CustomerModel } from "@/models/customer.model";
import SendSMS from "@/helpers/sms";

Connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { phone } = reqBody;
    const customer = await CustomerModel.findOne({ phone });
    if (!customer) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const smsResponse = SendSMS({
      phone_number: phone,
      smsType: "RESET",
      customerId: customer._id,
    });
    return NextResponse.json({ message: "OTP sent" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
