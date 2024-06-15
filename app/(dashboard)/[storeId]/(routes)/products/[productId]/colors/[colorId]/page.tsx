import FetchUser from "@/components/FetchUser";
import { ProductColorImagesForm } from "./components/product-color-image-form";
import {
  ProductImageData,
  ProductImageModel,
} from "@/models/productImage.model";
import { SizeData, SizeModel } from "@/models/size.model";
import mongoose from "mongoose";

const ProductColorImages = async ({
  params,
}: {
  params: { storeId: string; productId: string; colorId: string };
}) => {
  let productImages: ProductImageData = {
    _id: "",
    imageUrls: [],
    colorId: "",
    productId: "",
    storeId: "",
  };
  let size: SizeData = {
    _id: "",
    name: "",
    value: "",
    storeId: "",
    colorId: "",
    createdAt: "",
  };

  let allSizes: SizeData[] = [];

  let colorId = "";

  if (mongoose.Types.ObjectId.isValid(params.colorId)) {
    colorId = params.colorId;
    const foundProductImages =
      await ProductImageModel.findOne<ProductImageData>({
        colorId: params.colorId,
        productId: params.productId,
        storeId: params.storeId,
      });

    if (foundProductImages) {
      productImages = foundProductImages;
    }

    const foundSizes = await SizeModel.find<SizeData>({
      storeId: params.storeId,
    });
    if (foundSizes.length > 0) {
      allSizes = foundSizes;
    }

    const foundSize = await SizeModel.findOne<SizeData>({
      colorId: params.colorId,
      productId: params.productId,
      storeId: params.storeId,
    });

    if (foundSize) {
      size = foundSize;
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductColorImagesForm
            productImages={productImages}
            size={size}
            colorId={colorId}
            allSizes={allSizes}
          />
        </div>
      </div>
      <FetchUser />
    </>
  );
};

export default ProductColorImages;
