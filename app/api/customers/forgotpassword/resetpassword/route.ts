import { Connect } from "@/dbConfig/connect";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
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
    const { customerId, password } = reqBody;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      customerId,
      {
        $set: { hashedPassword, salt },
        $unset: { forgotPasswordOtp: 1, forgotPasswordOtpExpiry: 1 },
      },
      { new: true }
    );
    console.log(updatedCustomer);
    if (!updatedCustomer) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
