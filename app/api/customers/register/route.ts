import { Connect } from "@/dbConfig/connect";
import { CustomerModel } from "@/models/customer.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { CartModel } from "@/models/cart.model";

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

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name, phone, password } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (phone.length !== 10) {
      return NextResponse.json(
        { message: "Phone number should be 10 digits" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password should be at least 6 characters" },
        { status: 400, headers: corsHeaders }
      );
    }

    const existingCustomer = await CustomerModel.findOne({ phone });

    if (existingCustomer) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400, headers: corsHeaders }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newCustomer = new CustomerModel({
      name,
      phone,
      hashedPassword,
      salt,
    });
    const savedCustomer = await newCustomer.save();
    await CartModel.create({ customerId: savedCustomer._id, products: [] });

    // const smsResponse = SendSMS({
    //   phone_number: phone,
    //   smsType: "VERIFY",
    //   customerId: savedCustomer._id,
    // });

    // console.log(smsResponse);

    return NextResponse.json(
      {
        message: "User registered successfully",
        success: true,
        customer: savedCustomer,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
};
