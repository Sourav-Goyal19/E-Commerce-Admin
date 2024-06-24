import { Connect } from "@/dbConfig/connect";
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import mongoose from "mongoose";
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

const getCartKey = (cartId: string) => `cart-${cartId}`;

export const GET = async (
  req: NextRequest,
  { params }: { params: { cartId: string } }
) => {
  const cartId = params.cartId;

  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    return NextResponse.json(
      { message: "Invalid cart ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const cartCacheKey = getCartKey(cartId);
    const cartCache = await redis.get(cartCacheKey);

    if (cartCache) {
      return NextResponse.json(
        {
          message: "Cart Found (from redis)",
          cart: cartCache,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    const cart = await CartModel.findById(cartId).populate([
      {
        path: "products.productId",
        populate: {
          path: "productImages",
        },
      },
      {
        path: "products.colorId",
      },
      {
        path: "products.sizeId",
      },
    ]);

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    await redis.set(cartCacheKey, JSON.stringify(cart), { ex: 3600 * 24 * 7 });

    return NextResponse.json(
      {
        message: "Cart Found",
        cart,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.log("CART-ID[GET]:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500, headers: corsHeaders }
    );
  }
};
