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
  const body = await req.json();
  const { productId } = body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { message: "Invalid Product ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const updatedCart = await CartModel.findOneAndUpdate(
      { customerId },
      {
        products: {
          $pull: { productId },
        },
      }
    );

    if (!updatedCart) {
      return NextResponse.json(
        { message: "Cart not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        message: "Item removed from cart successfully",
        cart: updatedCart,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.log("CART[PATCH]:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500, headers: corsHeaders }
    );
  }
};
