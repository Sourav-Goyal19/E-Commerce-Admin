import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { CategoryModel } from "@/models/category.model";
import { StoreModel } from "@/models/store.model";
import mongoose from "mongoose";
import redis from "@/lib/redis";

Connect();

const getCategoryCacheKey = (id: string) => `category: ${id}`;

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const categoryId = params.id;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return NextResponse.json(
      { message: "Invalid category ID" },
      { status: 400 }
    );
  }

  try {
    const cacheKey = getCategoryCacheKey(categoryId);
    const cachedCategory = await redis.get(cacheKey);

    if (cachedCategory) {
      return NextResponse.json(
        {
          message: "Category Found (from redis)",
          category: cachedCategory,
        },
        { status: 200 }
      );
    }

    const category = await CategoryModel.findById(categoryId);
    await redis.set(cacheKey, JSON.stringify(category), { ex: 60 * 60 * 24 });

    return NextResponse.json(
      { message: "Category Found", category },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("CATEGORY[GET]:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const storeId = params.id;
  const body = await req.json();
  const { name, billboardId } = body;

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  if (!storeId) {
    return NextResponse.json(
      { message: "Store ID is required" },
      { status: 400 }
    );
  }

  if (!billboardId) {
    return NextResponse.json(
      { message: "Billboard is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(billboardId)) {
    return NextResponse.json({ message: "Invalid billboard" }, { status: 400 });
  }

  try {
    const category = await CategoryModel.create({
      name,
      storeId,
      billboardId,
    });

    await StoreModel.findByIdAndUpdate(storeId, {
      $push: { categories: category._id },
    });

    return NextResponse.json(
      { message: "Category Created", category },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("CATEGORY[POST]:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const categoryId = params.id;
  console.log(categoryId);

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return NextResponse.json(
      { message: "Invalid Category ID" },
      { status: 400 }
    );
  }

  const body = await req.json();
  console.log(body);
  const { name, billboardId } = body;

  if (!name && !billboardId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 422 }
    );
  }

  if (billboardId && !mongoose.Types.ObjectId.isValid(billboardId)) {
    return NextResponse.json({ message: "Invalid billboard" }, { status: 400 });
  }

  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        name,
        categoryId,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    await redis.del(getCategoryCacheKey(categoryId));

    return NextResponse.json(
      { message: "Category Updated", category: updatedCategory },
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
  const categoryId = params.id;
  console.log(categoryId);

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return NextResponse.json(
      { message: "Invalid Category ID" },
      { status: 400 }
    );
  }

  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    await StoreModel.findByIdAndUpdate(
      deletedCategory.storeId,
      { $pull: { categories: categoryId } },
      { new: true }
    );

    await redis.del(getCategoryCacheKey(categoryId));

    return NextResponse.json({ message: "Category Deleted" }, { status: 200 });
  } catch (error: any) {
    console.log("BILLBOARD[DELETE] :", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
