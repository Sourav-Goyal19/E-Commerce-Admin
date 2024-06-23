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

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  const customerId = params.customerId;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return NextResponse.json(
      { message: "Invalid cart ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const updatedCart = await CartModel.findOneAndUpdate(
      { customerId },
      {
        products: [],
      }
    );

    return NextResponse.json(
      { message: "All Items removed from the cart", updatedCart },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.log("CART[PATCH]:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
};
