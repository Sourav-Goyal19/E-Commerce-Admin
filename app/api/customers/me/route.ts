import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { CustomerData, CustomerModel } from "@/models/customer.model";
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

    const customer: CustomerData | null = await CustomerModel.findById(
      customerId
    )
      .select("-hashedPassword")
      .select("-salt")
      .select("-__v")
      .populate("address");
    // console.log(user);
    if (!customer) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const cart = await CartModel.findOne({ customerId: customer._id })
      .populate({
        path: "products.productId products.colorId products.sizeId",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: "User Found",
        customer,
        cart,
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
