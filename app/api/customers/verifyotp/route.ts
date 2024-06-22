import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { CustomerModel } from "@/models/customer.model";

Connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { otp } = reqBody;
    // console.log(token, "token");
    const customer = await CustomerModel.findOne({
      verificationCode: otp,
      verificationCodeExpiry: { $gt: Date.now() },
    });
    // console.log("🚀 ~ GET ~customerer:", user);

    if (!customer) {
      return NextResponse.json(
        {
          message: "Token is invalid",
        },
        { status: 400 }
      );
    }

    // console.log(user);

    customer.isVerified = true;
    customer.verificationCode = undefined;
    customer.verificationCodeExpiry = undefined;

    await customer.save();

    return NextResponse.json(
      { message: "Phone Number Verified Successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
