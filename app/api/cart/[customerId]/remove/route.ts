import mongoose from "mongoose";
import { Connect } from "@/dbConfig/connect";
import { CartModel } from "@/models/cart.model";
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

Connect();

const getCartCacheKey = (cartId: string) => `cart-${cartId}`;

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
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
  const { productId, colorId, sizeId } = body;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return NextResponse.json(
      { message: "Invalid Customer ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(colorId)) {
    return NextResponse.json(
      { message: "Invalid Color ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(sizeId)) {
    return NextResponse.json(
      { message: "Invalid Size ID" },
      { status: 400, headers: corsHeaders }
    );
  }

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
        $pull: {
          products: { productId, colorId, sizeId },
        },
      },
      { new: true }
    ).populate([
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

    if (!updatedCart) {
      return NextResponse.json(
        { message: "Cart not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const cartCacheKey = getCartCacheKey(updatedCart._id);
    await redis.del(cartCacheKey);

    return NextResponse.json(
      {
        message: "Item removed from cart successfully",
        cart: updatedCart,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("CART[PATCH]:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500, headers: corsHeaders }
    );
  }
};
