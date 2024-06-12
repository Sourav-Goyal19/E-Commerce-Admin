import { Connect } from "@/dbConfig/connect";
import { BillboardModel } from "@/models/billboard.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

Connect();

const getBillboardsCacheKey = (storeId: string) => `billboards:${storeId}`;

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  const storeId = params.storeId;

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return new Response("Invalid store id", { status: 400 });
  }

  try {
    const cacheKey = getBillboardsCacheKey(storeId);
    const cachedBillboards = await redis.lrange(cacheKey, 0, -1);

    if (cachedBillboards && cachedBillboards.length > 0) {
      return NextResponse.json(
        {
          message: "Billboards found (from cache)",
          billboards: cachedBillboards,
        },
        { status: 200 }
      );
    }

    const billboards = await BillboardModel.find({ storeId });

    if (billboards.length <= 0) {
      return NextResponse.json(
        { message: "No Billboards Found" },
        { status: 404 }
      );
    }

    await redis.del(cacheKey);
    for (const billboard of billboards) {
      await redis.rpush(cacheKey, JSON.stringify(billboard));
    }

    const updatedCachedBillboards = await redis.lrange(cacheKey, 0, -1);

    return NextResponse.json(
      { message: "Billboards Found", billboards: updatedCachedBillboards },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("BILLBOARDS[GET] : ", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
