import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { StoreModel } from "@/models/store.model";
import mongoose from "mongoose";
import redis from "@/lib/redis";
import { ColorModel } from "@/models/color.model";
import { ProductModel } from "@/models/product.model";

Connect();

const getColorCacheKey = (id: string) => `color: ${id}`;

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const colorId = params.id;

  if (!mongoose.Types.ObjectId.isValid(colorId)) {
    return NextResponse.json({ message: "Invalid color ID" }, { status: 400 });
  }

  try {
    const cacheKey = getColorCacheKey(colorId);
    const cachedColor = await redis.get(cacheKey);

    if (cachedColor) {
      return NextResponse.json(
        {
          message: "Color Found (from redis)",
          color: cachedColor,
        },
        { status: 200 }
      );
    }

    const color = await ColorModel.findById(colorId);
    await redis.set(cacheKey, JSON.stringify(color), { ex: 60 * 60 * 24 });

    return NextResponse.json(
      { message: "Color Found", color },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("COLOR[GET]:", error.message);
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
      { message: "Color name is required" },
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
      { message: "Color value is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
  }

  try {
    const color = await ColorModel.create({
      name,
      storeId,
      value,
    });

    await redis.del(`colors:${storeId}`);

    await StoreModel.findByIdAndUpdate(storeId, {
      $push: { colors: color._id },
    });

    return NextResponse.json(
      { message: "Color Created", color },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("COLOR[POST]:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const colorId = params.id;

  if (!mongoose.Types.ObjectId.isValid(colorId)) {
    return NextResponse.json({ message: "Invalid color ID" }, { status: 400 });
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
    const updatedColor = await ColorModel.findByIdAndUpdate(
      colorId,
      {
        name,
        value,
      },
      { new: true }
    );

    if (!updatedColor) {
      return NextResponse.json({ message: "Color not found" }, { status: 404 });
    }

    await redis.del(getColorCacheKey(colorId));
    await redis.del(`colors:${updatedColor.storeId}`);

    return NextResponse.json(
      { message: "Color Updated", color: updatedColor },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("COLOR[PATCH] :", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const colorId = params.id;

  if (!mongoose.Types.ObjectId.isValid(colorId)) {
    return NextResponse.json({ message: "Invalid color ID" }, { status: 400 });
  }

  try {
    const products = await ProductModel.find({ colorId });
    if (products.length > 0) {
      return NextResponse.json(
        {
          message: "Make sure you removed all products using this color first.",
        },
        { status: 400 }
      );
    }

    const deletedColor = await ColorModel.findByIdAndDelete(colorId);

    if (!deletedColor) {
      return NextResponse.json({ message: "Color not found" }, { status: 404 });
    }

    await StoreModel.findByIdAndUpdate(
      deletedColor.storeId,
      { $pull: { colors: colorId } },
      { new: true }
    );

    await redis.del(getColorCacheKey(colorId));
    await redis.del(`colors:${deletedColor.storeId}`);

    return NextResponse.json({ message: "Color Deleted" }, { status: 200 });
  } catch (error: any) {
    console.log("COLOR[DELETE] :", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
