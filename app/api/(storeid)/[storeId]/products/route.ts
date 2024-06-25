import { Connect } from "@/dbConfig/connect";
import { NextRequest, NextResponse } from "next/server";
import { ProductModel } from "@/models/product.model";
import { ProductImageModel } from "@/models/productImage.model";
import mongoose from "mongoose";

Connect();

const getProductsCacheKey = (storeId: string, queryObj: any) => {
  const queryStr = Object.keys(queryObj)
    .map((key) => `${key}:${queryObj[key]}`)
    .join(":");
  return `products:${storeId}:${queryStr}`;
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { storeId: string } }
) => {
  const storeId = params.storeId;
  const searchParams = req.nextUrl.searchParams;
  const categoryId = searchParams.get("categoryId");
  const sizeId = searchParams.get("sizeId");
  const colorId = searchParams.get("colorId");
  const isFeatured = searchParams.get("isFeatured");

  if (!storeId) {
    return NextResponse.json(
      { message: "Store id is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid store id" }, { status: 400 });
  }

  const queryConditions: any[] = [{ storeId }];

  if (categoryId) queryConditions.push({ categoryId });
  if (isFeatured) queryConditions.push({ isFeatured: true });

  const query: any = { $and: queryConditions };

  const productImageQuery: any = {};
  if (colorId && sizeId) {
    productImageQuery.$and = [{ colorId }, { sizeId }];
  } else {
    if (colorId) productImageQuery.colorId = colorId;
    if (sizeId) productImageQuery.sizeId = sizeId;
  }

  try {
    const productImages = await ProductImageModel.find(productImageQuery);
    const productImageIds = productImages.map((image) => image._id);

    if (productImageIds.length === 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }
    query.$and.push({ productImages: { $in: productImageIds } });

    console.log(query);

    const products = await ProductModel.find(query)
      .populate("productImages")
      .populate("colorId")
      .populate("sizeId")
      .populate("categoryId")
      .sort({
        createdAt: -1,
      });

    if (products.length <= 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }

    console.log(products);

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
