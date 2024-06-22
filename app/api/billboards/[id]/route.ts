import { Connect } from "@/dbConfig/connect";
import { BillboardModel } from "@/models/billboard.model";
import { StoreModel } from "@/models/store.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { CategoryModel } from "@/models/category.model";

Connect();

const getBillboardCacheKey = (id: string) => `billboard:${id}`;

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const billboardId = params.id;

  if (!mongoose.Types.ObjectId.isValid(billboardId)) {
    return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
  }

  try {
    const cacheKey = getBillboardCacheKey(billboardId);
    const cachedBillboard = await redis.get(cacheKey);

    if (cachedBillboard) {
      return NextResponse.json({
        message: "Billboard found (from redis)",
        billboard: cachedBillboard,
      });
    }

    const billboard = await BillboardModel.findById(billboardId);

    if (!billboard) {
      return NextResponse.json(
        { message: "Billboard not found" },
        { status: 404 }
      );
    }

    await redis.set(cacheKey, JSON.stringify(billboard), { ex: 3600 * 24 });

    return NextResponse.json({ message: "Billboard found", billboard });
  } catch (error: any) {
    console.log("BILLBOARD[GET] :", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const storeId = params.id;
  const body = await req.json();
  const { label, imageUrl } = body;

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
  }

  if (!label || !imageUrl) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 422 }
    );
  }
  try {
    const Billboard = await BillboardModel.create({
      label,
      imageUrl,
      storeId,
    });

    await redis.del(`billboards:${storeId}`);

    const updatedStore = await StoreModel.findByIdAndUpdate(
      storeId,
      { $push: { billboards: Billboard._id } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Billboard Created", Billboard },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("BILLBOARD[POST] :", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const billboardId = params.id;
  console.log(billboardId);

  if (!mongoose.Types.ObjectId.isValid(billboardId)) {
    return NextResponse.json(
      { message: "Invalid billboard ID" },
      { status: 400 }
    );
  }

  const body = await req.json();
  console.log(body);
  const { label, imageUrl } = body;

  if (!label && !imageUrl) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 422 }
    );
  }

  try {
    const updatedBillboard = await BillboardModel.findByIdAndUpdate(
      billboardId,
      { label, imageUrl },
      { new: true }
    );

    if (!updatedBillboard) {
      return NextResponse.json(
        { message: "Billboard not found" },
        { status: 404 }
      );
    }

    await redis.del(getBillboardCacheKey(billboardId));
    await redis.del(`billboards:${updatedBillboard.storeId}`);

    return NextResponse.json(
      { message: "Billboard Updated", billboard: updatedBillboard },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("BILLBOARD[PATCH] :", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const billboardId = params.id;
  console.log(billboardId);

  if (!mongoose.Types.ObjectId.isValid(billboardId)) {
    return NextResponse.json(
      { message: "Invalid billboard ID" },
      { status: 400 }
    );
  }

  try {
    const categories = await CategoryModel.find({ billboardId });
    if (categories.length > 0) {
      return NextResponse.json(
        {
          message:
            "Make sure you removed all categories using this billboard first.",
        },
        { status: 400 }
      );
    }

    const deletedBillboard =
      await BillboardModel.findByIdAndDelete(billboardId);

    if (!deletedBillboard) {
      return NextResponse.json(
        { message: "Billboard not found" },
        { status: 404 }
      );
    }

    await redis.del(getBillboardCacheKey(billboardId));
    await redis.del(`billboards:${deletedBillboard.storeId}`);

    const updatedStore = await StoreModel.findByIdAndUpdate(
      deletedBillboard.storeId,
      { $pull: { billboards: billboardId } },
      { new: true }
    );

    return NextResponse.json({ message: "Billboard Deleted" }, { status: 200 });
  } catch (error: any) {
    console.log("BILLBOARD[DELETE] :", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
