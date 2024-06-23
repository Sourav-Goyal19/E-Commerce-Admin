import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomerData, CustomerModel } from "@/models/customer.model";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    const customer: CustomerData | null = await CustomerModel.findOne({
      phone,
    });

    if (!customer) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    console.log(customer);

    const isMatch = await bcryptjs.compare(password, customer.hashedPassword!);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401, headers: corsHeaders }
      );
    }

    // if (!customer.isVerified) {
    //   return NextResponse.json(
    //     { message: "Phone number is not verified" },
    //     { status: 401, headers: corsHeaders }
    //   );
    // }

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        customer,
      },
      { status: 200, headers: corsHeaders }
    );

    const jwtUser = {
      id: customer._id,
      phone: customer.phone,
    };

    const token = jwt.sign(
      jwtUser,
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    console.log(token);

    response.cookies.set("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    return response;
  } catch (error: any) {
    NextResponse.json(
      { message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
