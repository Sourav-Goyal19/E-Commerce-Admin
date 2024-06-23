import mongoose from "mongoose";
import { Connect } from "@/dbConfig/connect";
import { CartModel } from "@/models/cart.model";
import { NextRequest, NextResponse } from "next/server";

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
export async function GET(
  req: NextRequest,
  { params }: { params: { customerId: string } }
) {
  const customerId = params.customerId;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return NextResponse.json(
      { message: "Invalid Customer ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const cart = await CartModel.findOne({ customerId }).populate({
      path: "products.productId products.colorId products.sizeId",
    });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: "Cart Found", cart },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.log("CART[GET]:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
