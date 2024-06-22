import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { ProductImageModel } from "@/models/productImage.model";
import mongoose from "mongoose";
import redis from "@/lib/redis";

Connect();

const getImageCacheKey = (id: string) => `productImage:${id}`;

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const productImageId = params.id;

  if (!mongoose.Types.ObjectId.isValid(productImageId)) {
    return NextResponse.json(
      { message: "Invalid product image ID" },
      { status: 400 }
    );
  }

  try {
    const cacheKey = getImageCacheKey(productImageId);
    const cacheResponse = await redis.get(cacheKey);

    if (cacheResponse) {
      return NextResponse.json(
        {
          message: "Product Image Found (from redis)",
          productImages: cacheResponse,
        },
        { status: 200 }
      );
    }

    const productImage = await ProductImageModel.findById(productImageId);

    if (!productImage) {
      return NextResponse.json(
        { message: "Product Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Product Image found",
        productImage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("PRODUCTIMAGE[GET]:", error);
    return NextResponse.json(
      { message: "Internal Error Occured" },
      { status: 500 }
    );
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const storeId = params.id;
  const body = await req.json();
  const { colorId, sizeId, imageUrls } = body;

  if (!colorId || !sizeId || !imageUrls) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
  }
  if (!mongoose.Types.ObjectId.isValid(colorId)) {
    return NextResponse.json({ message: "Invalid color ID" }, { status: 400 });
  }

  try {
    const productImage = await ProductImageModel.create({
      storeId,
      colorId,
      sizeId,
      imageUrls,
    });

    const pipeline = redis.pipeline();
    const cacheKey = getImageCacheKey(productImage._id.toString());
    await pipeline
      .set(cacheKey, JSON.stringify(productImage), { ex: 3600 * 24 * 7 })
      .exec();

    return NextResponse.json(
      {
        message: "Product Image created successfully",
        productImage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("PRODUCTIMAGE[POST]:", error);
    return NextResponse.json(
      { message: "Internal Error Occured" },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const productImageId = params.id;
  const body = await req.json();
  const { colorId, sizeId, imageUrls } = body;

  if (!colorId && !sizeId && !imageUrls) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(productImageId)) {
    return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
  }
  if (colorId && !mongoose.Types.ObjectId.isValid(colorId)) {
    return NextResponse.json({ message: "Invalid color ID" }, { status: 400 });
  }

  try {
    const cacheKey = getImageCacheKey(productImageId);

    const updatedProductImage = await ProductImageModel.findByIdAndUpdate(
      productImageId,
      { $set: { colorId, sizeId, imageUrls } },
      { new: true }
    );

    if (!updatedProductImage) {
      return NextResponse.json(
        { message: "Product Image not found" },
        { status: 404 }
      );
    }

    await redis.del(cacheKey);

    return NextResponse.json(
      {
        message: "Product Image updated successfully",
        productImage: updatedProductImage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("PRODUCTIMAGE[PATCH]:", error);
    return NextResponse.json(
      { message: "Internal Error Occured" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const productImageId = params.id;

  if (!mongoose.Types.ObjectId.isValid(productImageId)) {
    return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
  }

  try {
    const cacheKey = getImageCacheKey(productImageId);
    const deletedProductImage =
      await ProductImageModel.findByIdAndDelete(productImageId);

    if (!deletedProductImage) {
      return NextResponse.json(
        { message: "Product Image not found" },
        { status: 404 }
      );
    }

    await redis.del(cacheKey);

    return NextResponse.json(
      {
        message: "Product Image deleted successfully",
        productImage: deletedProductImage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("PRODUCTIMAGE[DELETE]:", error);
    return NextResponse.json(
      { message: "Internal Error Occured" },
      { status: 500 }
    );
  }
};
