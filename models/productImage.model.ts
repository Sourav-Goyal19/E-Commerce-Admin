import mongoose, { Document, Schema, model, models } from "mongoose";
import { SizeData } from "./size.model";
import { ColorData } from "./color.model";
import { ProductData } from "./product.model";

interface ProductImages extends Document {
  imageUrls: string[];
  productId: string | mongoose.Schema.Types.ObjectId | ProductData;
  colorId: string | mongoose.Schema.Types.ObjectId | ColorData;
  storeId: string | mongoose.Schema.Types.ObjectId;
  sizeId: string[] | mongoose.Schema.Types.ObjectId[] | SizeData[];
}

export interface ProductImageData {
  _id: string;
  imageUrls: string[];
  productId?: string | mongoose.Schema.Types.ObjectId | ProductData;
  colorId: string | mongoose.Schema.Types.ObjectId | ColorData;
  storeId: string | mongoose.Schema.Types.ObjectId;
  sizeId: string[] | mongoose.Schema.Types.ObjectId[] | SizeData[];
}

const ProductImageSchema: Schema<ProductImages> = new Schema(
  {
    imageUrls: [
      {
        type: String,
        required: true,
      },
    ],
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    colorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Colors",
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stores",
      required: true,
    },
    sizeId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sizes",
      },
    ],
  },
  { timestamps: true }
);

export const ProductImageModel =
  (models.Productimages as mongoose.Model<ProductImages>) ||
  model<ProductImages>("Productimages", ProductImageSchema);
