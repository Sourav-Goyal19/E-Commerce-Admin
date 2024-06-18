import { Connect } from "@/dbConfig/connect";
import { ProductImageModel } from "@/models/productImage.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

Connect();

export const GET = async (
  req: NextRequest,
  { params }: { params: { storeId: string } }
) => {
  const storeId = params.storeId;

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
  }

  try {
    const productImages = await ProductImageModel.find({ storeId: storeId });
    if (productImages.length <= 0) {
      return NextResponse.json(
        { message: "No product images found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Product Images Found",
        productImages: productImages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("PRODUCTIMAGES[GET]:", error);
    return NextResponse.json(
      { message: `Internal Server Error` },
      { status: 500 }
    );
  }
};
