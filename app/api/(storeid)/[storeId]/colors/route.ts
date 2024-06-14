import { Connect } from "@/dbConfig/connect";
import redis from "@/lib/redis";
import { ColorModel } from "@/models/color.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

Connect();

const getColorCacheKey = (storeId: string) => `colors:${storeId}`;

export const GET = async (
  req: NextRequest,
  { params }: { params: { storeId: string } }
) => {
  const storeId = params.storeId;

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid Store Id" }, { status: 400 });
  }

  try {
    const cacheKey = getColorCacheKey(storeId);
    const cachedColors = await redis.lrange(cacheKey, 0, -1);

    if (cachedColors.length > 0) {
      return NextResponse.json(
        {
          message: "Colors Found (from redis)",
          colors: cachedColors,
        },
        { status: 200 }
      );
    }

    const colors = await ColorModel.find({ storeId });
    const pipeline = redis.pipeline();
    colors.forEach((color) => {
      pipeline.rpush(cacheKey, JSON.stringify(color));
    });

    pipeline.expire(cacheKey, 3600 * 24);
    await pipeline.exec();

    return NextResponse.json(
      { message: "Colors Found", colors },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("COLORS[GET]:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
