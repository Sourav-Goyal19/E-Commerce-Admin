import { Connect } from "@/dbConfig/connect";
import redis from "@/lib/redis";
import { SizeModel } from "@/models/size.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

Connect();

const getSizeCacheKey = (id: string) => `sizes:${id}`;

export const GET = async (
  req: NextRequest,
  { params }: { params: { storeId: string } }
) => {
  const storeId = params.storeId;
  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid store Id" }, { status: 400 });
  }

  try {
    const cacheKey = getSizeCacheKey(storeId);
    const cachedSizeData = await redis.lrange(cacheKey, 0, -1);

    if (cachedSizeData.length > 0) {
      return NextResponse.json(
        {
          message: "Sizes Found (from redis)",
          sizes: cachedSizeData,
        },
        { status: 200 }
      );
    }

    const sizes = await SizeModel.find({ storeId }).sort({ createdAt: -1 });

    if (sizes.length <= 0) {
      return NextResponse.json({ message: "No Sizes Found" }, { status: 404 });
    }

    const pipeline = redis.pipeline();
    pipeline.del(cacheKey);
    for (const size of sizes) {
      pipeline.rpush(cacheKey, JSON.stringify(size));
    }
    pipeline.expire(cacheKey, 60 * 60 * 24);
    await pipeline.exec();

    return NextResponse.json(
      { message: "Sizes Found", sizes },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("SIZES[GET]:", error.message);
    return NextResponse.json(
      { message: `Internal Server Error` },
      { status: 500 }
    );
  }
};
