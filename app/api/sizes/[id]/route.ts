import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { StoreModel } from "@/models/store.model";
import { SizeModel } from "@/models/size.model";
import mongoose from "mongoose";
import redis from "@/lib/redis";

Connect();

const getSizeCacheKey = (id: string) => `size: ${id}`;

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const sizeId = params.id;

  if (!mongoose.Types.ObjectId.isValid(sizeId)) {
    return NextResponse.json({ message: "Invalid size ID" }, { status: 400 });
  }

  try {
    const cacheKey = getSizeCacheKey(sizeId);
    const cachedSize = await redis.get(cacheKey);

    if (cachedSize) {
      return NextResponse.json(
        {
          message: "Size Found (from redis)",
          size: cachedSize,
        },
        { status: 200 }
      );
    }

    const size = await SizeModel.findById(sizeId);
    await redis.set(cacheKey, JSON.stringify(size), { ex: 60 * 60 * 24 });

    return NextResponse.json({ message: "Size Found", size }, { status: 200 });
  } catch (error: any) {
    console.log("SIZE[GET]:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const storeId = params.id;
  const body = await req.json();
  const { name, value } = body;

  if (!name) {
    return NextResponse.json(
      { message: "Size name is required" },
      { status: 400 }
    );
  }

  if (!storeId) {
    return NextResponse.json(
      { message: "Store ID is required" },
      { status: 400 }
    );
  }

  if (!value) {
    return NextResponse.json(
      { message: "Size value is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
  }

  try {
    const size = await SizeModel.create({
      name,
      storeId,
      value,
    });

    await redis.del(`sizes:${storeId}`);

    await StoreModel.findByIdAndUpdate(storeId, {
      $push: { sizes: size._id },
    });

    return NextResponse.json(
      { message: "Size Created", size },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("SIZE[POST]:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const sizeId = params.id;
  console.log(sizeId);

  if (!mongoose.Types.ObjectId.isValid(sizeId)) {
    return NextResponse.json({ message: "Invalid size ID" }, { status: 400 });
  }

  const body = await req.json();
  console.log(body);
  const { name, value } = body;

  if (!name && !value) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 422 }
    );
  }

  try {
    const updatedSize = await SizeModel.findByIdAndUpdate(
      sizeId,
      {
        name,
        value,
      },
      { new: true }
    );

    if (!updatedSize) {
      return NextResponse.json({ message: "Size not found" }, { status: 404 });
    }

    await redis.del(getSizeCacheKey(sizeId));
    await redis.del(`sizes:${updatedSize.storeId}`);

    return NextResponse.json(
      { message: "Size Updated", size: updatedSize },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("SIZE[PATCH] :", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const sizeId = params.id;

  if (!mongoose.Types.ObjectId.isValid(sizeId)) {
    return NextResponse.json({ message: "Invalid size ID" }, { status: 400 });
  }

  try {
    const deletedsize = await SizeModel.findByIdAndDelete(sizeId);

    if (!deletedsize) {
      return NextResponse.json({ message: "Size not found" }, { status: 404 });
    }

    await StoreModel.findByIdAndUpdate(
      deletedsize.storeId,
      { $pull: { sizes: sizeId } },
      { new: true }
    );

    await redis.del(getSizeCacheKey(sizeId));
    await redis.del(`sizes:${deletedsize.storeId}`);

    return NextResponse.json({ message: "Size Deleted" }, { status: 200 });
  } catch (error: any) {
    console.log("SIZE[DELETE] :", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
