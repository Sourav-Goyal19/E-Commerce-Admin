import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { CustomerModel } from "@/models/customer.model";

Connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { otp } = reqBody;

    // console.log(token);

    const customer = await CustomerModel.findOne({
      forgotPasswordOtp: otp,
      forgotPasswordOtpExpiry: { $gt: Date.now() },
    });

    // console.log(customer);

    if (!customer) {
      return NextResponse.json(
        {
          message: "OTP has expired",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "OTP is valid", customer },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
