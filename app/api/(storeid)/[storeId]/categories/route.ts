import { Connect } from "@/dbConfig/connect";
import redis from "@/lib/redis";
import { CategoryModel } from "@/models/category.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

Connect();

const getCategoryCacheKey = (storeId: string) => `categories:${storeId}`;

export const GET = async (
  req: NextRequest,
  { params }: { params: { storeId: string } }
) => {
  const { storeId } = params;

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid Store Id" }, { status: 401 });
  }

  try {
    const cacheKey = getCategoryCacheKey(storeId);
    const cachedCategories = await redis.lrange(cacheKey, 0, -1);

    if (cachedCategories.length > 0) {
      return NextResponse.json(
        {
          message: "Categories found (from redis)",
          categories: cachedCategories,
        },
        { status: 200 }
      );
    }

    const categories = await CategoryModel.find({
      storeId: storeId,
    }).sort({ createdAt: -1 });

    if (categories.length === 0) {
      return NextResponse.json(
        { message: "No Categories Found" },
        { status: 404 }
      );
    }

    const pipeline = redis.pipeline();
    pipeline.del(cacheKey);
    for (const category of categories) {
      pipeline.rpush(cacheKey, JSON.stringify(category));
    }
    pipeline.expire(cacheKey, 60 * 60 * 24);

    await pipeline.exec();

    const updatedCachedCategories = await redis.lrange(cacheKey, 0, -1);

    return NextResponse.json(
      { message: "Categories Found", categories: updatedCachedCategories },
      { status: 200 }
    );
  } catch (error) {
    console.error("CATEGORIES[GET]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
