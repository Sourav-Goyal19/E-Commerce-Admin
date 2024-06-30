import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { CustomerModel } from "@/models/customer.model";

Connect();

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

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
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: "OTP is valid", customer },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500, headers: corsHeaders }
    );
  }
}
