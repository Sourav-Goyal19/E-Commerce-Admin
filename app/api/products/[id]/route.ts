import { Connect } from "@/dbConfig/connect";
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import mongoose from "mongoose";
import { ProductModel } from "@/models/product.model";
import { ProductImageModel } from "@/models/productImage.model";
import { StoreModel } from "@/models/store.model";

Connect();

const getProductCachekey = (productId: string) => `product:${productId}`;

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const productId = params.id;
  if (!productId) {
    return NextResponse.json(
      { error: "Product id is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const productCacheKey = getProductCachekey(productId);
    const productCache = await redis.get(productCacheKey);
    // if (productCache) {
    //   return NextResponse.json(
    //     {
    //       message: "Product Found (from redis)",
    //       product: productCache,
    //     },
    //     { status: 200 }
    //   );
    // }

    const product = await ProductModel.findById(productId)
      .populate({
        path: "productImages",
        populate: [{ path: "colorId" }, { path: "sizeId" }],
      })
      .populate("categoryId")
      .populate("sizeId")
      .populate("colorId");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // const pipeline = redis.pipeline();
    // pipeline.set(productCacheKey, JSON.stringify(product));
    // pipeline.expire(productCacheKey, 3600 * 24 * 7);
    // await pipeline.exec();

    return NextResponse.json(
      {
        message: "Product Found",
        product: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("PRODUCT[GET]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
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
  const {
    name,
    price,
    description,
    colorId,
    productImages,
    isFeatured,
    isArchived,
    categoryId,
    sizeId,
  } = body;

  if (!name) {
    return NextResponse.json(
      { message: "Product Name is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    return NextResponse.json({ message: "Invalid store id" }, { status: 400 });
  }

  if (!price) {
    return NextResponse.json(
      { message: "Product Price is required" },
      { status: 400 }
    );
  }

  if (!description) {
    return NextResponse.json(
      { message: "Product Description is required" },
      { status: 400 }
    );
  }

  if (colorId.length <= 0) {
    return NextResponse.json(
      { message: "Product Color is required" },
      { status: 400 }
    );
  }

  if (sizeId.length <= 0) {
    return NextResponse.json(
      { message: "Product Size is required" },
      { status: 400 }
    );
  }

  if (!categoryId) {
    return NextResponse.json(
      { message: "Product Category is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return NextResponse.json(
      { message: "Invalid category id" },
      { status: 400 }
    );
  }

  if (productImages.length <= 0) {
    return NextResponse.json(
      { message: "Product Images are required" },
      { status: 400 }
    );
  }

  if (typeof isFeatured !== "boolean") {
    return NextResponse.json(
      { message: "Invalid isFeatured value" },
      { status: 400 }
    );
  }

  if (typeof isArchived !== "boolean") {
    return NextResponse.json(
      { message: "Invalid isArchived value" },
      { status: 400 }
    );
  }

  try {
    const product = await ProductModel.create({
      name,
      price,
      description,
      isFeatured,
      isArchived,
      sizeId,
      colorId,
      categoryId,
      storeId,
      productImageId: productImages,
    });

    const productId = product._id;
    await Promise.all(
      productImages.map(async (imageId: string) => {
        await ProductImageModel.findByIdAndUpdate(imageId, { productId });
      })
    );
    await StoreModel.findByIdAndUpdate(storeId, {
      $push: { products: productId },
    });

    await redis.del(`products:${storeId}`);

    return NextResponse.json(
      {
        message: "Product Created Successfully",
        product: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("PRODUCT[POST]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const productId = params.id;
  const body = await req.json();
  const {
    name,
    price,
    description,
    colorId,
    productImages,
    isFeatured,
    isArchived,
    categoryId,
    sizeId,
  } = body;

  if (!name) {
    return NextResponse.json(
      { message: "Product Name is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { message: "Invalid Product id" },
      { status: 400 }
    );
  }

  if (!price) {
    return NextResponse.json(
      { message: "Product Price is required" },
      { status: 400 }
    );
  }

  if (!description) {
    return NextResponse.json(
      { message: "Product Description is required" },
      { status: 400 }
    );
  }

  if (colorId.length <= 0) {
    return NextResponse.json(
      { message: "Product Color is required" },
      { status: 400 }
    );
  }

  if (sizeId.length <= 0) {
    return NextResponse.json(
      { message: "Product Size is required" },
      { status: 400 }
    );
  }

  if (!categoryId) {
    return NextResponse.json(
      { message: "Product Category is required" },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return NextResponse.json(
      { message: "Invalid category id" },
      { status: 400 }
    );
  }

  if (productImages.length <= 0) {
    return NextResponse.json(
      { message: "Product Images are required" },
      { status: 400 }
    );
  }

  if (typeof isFeatured !== "boolean") {
    return NextResponse.json(
      { message: "Invalid isFeatured value" },
      { status: 400 }
    );
  }

  if (typeof isArchived !== "boolean") {
    return NextResponse.json(
      { message: "Invalid isArchived value" },
      { status: 400 }
    );
  }

  try {
    const productCacheKey = getProductCachekey(productId);
    const updatedProject = await ProductModel.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        description,
        colorId,
        productImages,
        isFeatured,
        isArchived,
        sizeId,
        categoryId,
      },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const updatedProductId = updatedProject._id;
    await Promise.all(
      productImages.map(async (imageId: string) => {
        await ProductImageModel.findByIdAndUpdate(imageId, {
          productId: updatedProductId,
        });
      })
    );

    await redis.del(productCacheKey);
    await redis.del(`products:${updatedProject.storeId}`);

    return NextResponse.json(
      {
        message: "Product Updated Successfully",
        product: updatedProject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("PRODUCT[PATCH]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const productId = params.id;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { message: "Invalid Product id" },
      { status: 400 }
    );
  }

  try {
    const productCacheKey = getProductCachekey(productId);

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    await ProductImageModel.deleteMany({ productId: deletedProduct._id });
    await StoreModel.findByIdAndUpdate(deletedProduct.storeId, {
      $pull: { products: deletedProduct._id },
    });
    await redis.del(productCacheKey);
    await redis.del(`products:${deletedProduct.storeId}`);

    return NextResponse.json(
      {
        message: "Product Deleted Successfully",
        product: deletedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("PRODUCT[DELETE]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
