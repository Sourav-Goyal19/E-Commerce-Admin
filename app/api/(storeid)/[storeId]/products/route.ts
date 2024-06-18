import { Connect } from "@/dbConfig/connect";
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { ProductModel } from "@/models/product.model";
import mongoose from "mongoose";

Connect();

const getProductsCachekey = (storeId: string) => `products:${storeId}`;

export const GET = async (
  req: NextRequest,
  { params }: { params: { storeId: string } }
) => {
  const storeId = params.storeId;
  if (!storeId) {
    return NextResponse.json(
      { message: "Store id is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid store id" }, { status: 400 });
  }

  try {
    const productsCacheKey = getProductsCachekey(storeId);
    const cachedProducts = await redis.lrange(productsCacheKey, 0, -1);

    if (cachedProducts.length > 0) {
      return NextResponse.json(
        {
          message: "Products found (from redis)",
          products: cachedProducts,
        },
        { status: 200 }
      );
    }

    const products = await ProductModel.find({ storeId })
      .populate("productImages")
      .sort({
        createdAt: -1,
      });

    products.forEach(async (product) => {
      await redis.lpush(productsCacheKey, JSON.stringify(product));
    });

    return NextResponse.json(
      {
        message: "Products found",
        products: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("PRODUCTS[GET]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
