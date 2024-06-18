import mongoose, { Document, Schema, model, models } from "mongoose";

interface ProductImages extends Document {
  imageUrls: string[];
  productId: string | mongoose.Schema.Types.ObjectId;
  colorId: string | mongoose.Schema.Types.ObjectId;
  storeId: string | mongoose.Schema.Types.ObjectId;
  sizeId: string | mongoose.Schema.Types.ObjectId;
}

export interface ProductImageData {
  _id: string;
  imageUrls: string[];
  productId?: string | mongoose.Schema.Types.ObjectId;
  colorId: string | mongoose.Schema.Types.ObjectId;
  storeId: string | mongoose.Schema.Types.ObjectId;
  sizeId: string | mongoose.Schema.Types.ObjectId;
}

const ProductImagesSchema: Schema<ProductImages> = new Schema(
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
    sizeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sizes",
    },
  },
  { timestamps: true }
);

export const ProductImageModel =
  (models.ProductImages as mongoose.Model<ProductImages>) ||
  model<ProductImages>("ProductImages", ProductImagesSchema);
