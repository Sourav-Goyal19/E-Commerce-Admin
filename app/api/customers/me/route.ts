import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { CustomerData, CustomerModel } from "@/models/customer.model";

Connect();

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  try {
    const customerId = await getDataFromToken(req);
    // console.log(customerId);

    if (!customerId) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401, headers: corsHeaders }
      );
    }

    const customer: CustomerData = await CustomerModel.findById(customerId)
      .select("-hashedPassword")
      .select("-salt")
      .select("-__v");
    // console.log(user);
    if (!customer) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      {
        message: "User Found",
        customer,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
