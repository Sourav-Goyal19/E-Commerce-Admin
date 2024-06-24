import mongoose from "mongoose";
import { Connect } from "@/dbConfig/connect";
import { CartModel } from "@/models/cart.model";
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

Connect();

const getCartKey = (cartId: string) => `cart-${cartId}`;

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

export const POST = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  const customerId = params.customerId;
  const body = await req.json();
  const { productId, colorId, sizeId, quantity = 1 } = body;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return NextResponse.json(
      { message: "Invalid Customer ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { message: "Invalid Product ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!colorId) {
    return NextResponse.json(
      { message: "Color ID is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(colorId)) {
    return NextResponse.json(
      { message: "Invalid Color ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!sizeId) {
    return NextResponse.json(
      { message: "Size ID is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(sizeId)) {
    return NextResponse.json(
      { message: "Invalid Size ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    let cart = await CartModel.findOne({ customerId });

    if (!cart) {
      cart = await CartModel.create({ customerId });
    }

    if (cart?.products.length <= 0) {
      cart?.products.push({ productId, colorId, sizeId, quantity });
    } else {
      const productIndex = cart.products.findIndex(
        (product) =>
          product.productId.toString() === productId &&
          product.colorId.toString() === colorId &&
          product.sizeId.toString() === sizeId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, colorId, sizeId, quantity });
      }
    }
    await cart.save();

    await cart.populate({
      path: "products.productId products.colorId products.sizeId",
    });

    const cartCacheKey = getCartKey(cart._id.toString());
    await redis.del(cartCacheKey);

    return NextResponse.json(
      {
        message: "Item added to cart successfully",
        cart,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.log("CART[POST]:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500, headers: corsHeaders }
    );
  }
};
