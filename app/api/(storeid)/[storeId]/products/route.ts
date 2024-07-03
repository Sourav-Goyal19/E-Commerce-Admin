import { Connect } from "@/dbConfig/connect";
import { NextRequest, NextResponse } from "next/server";
import { ProductModel } from "@/models/product.model";
import { ProductImageModel } from "@/models/productImage.model";
import mongoose from "mongoose";

Connect();

export const GET = async (
  req: NextRequest,
  { params }: { params: { storeId: string } }
) => {
  const storeId = params.storeId;
  const { searchParams } = req.nextUrl;
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

  const query: any = {
    storeId,
    isArchived: false,
  };

  if (categoryId) query.categoryId = categoryId;
  if (isFeatured) query.isFeatured = true;

  try {
    let productImageIds: mongoose.Types.ObjectId[] = [];

    if (colorId || sizeId) {
      const productImageQuery: any = {};
      if (colorId) productImageQuery.colorId = colorId;
      if (sizeId) productImageQuery.sizeId = sizeId;

      const productImages = await ProductImageModel.find(productImageQuery);
      productImageIds = productImages.map((image) => image._id);

      if (productImageIds.length === 0) {
        return NextResponse.json(
          { message: "No products found" },
          { status: 404 }
        );
      }
    }

    if (productImageIds.length > 0) {
      query.productImages = { $in: productImageIds };
    }

    const products = await ProductModel.find(query)
      .populate("productImages")
      .populate("colorId")
      .populate("sizeId")
      .populate("categoryId")
      .sort({ createdAt: -1 });

    if (products.length === 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Products found", products },
      { status: 200 }
    );
  } catch (error) {
    console.error("PRODUCTS[GET]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
