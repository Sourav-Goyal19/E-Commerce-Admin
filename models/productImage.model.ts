import mongoose, { Schema, model, models } from "mongoose";

interface ProductImage extends Document {
  imageUrls: string[];
  productId: string | mongoose.Schema.Types.ObjectId;
  colorId: string | mongoose.Schema.Types.ObjectId[];
  storeId: string | mongoose.Schema.Types.ObjectId;
}

export interface ProductImageData {
  _id: string;
  imageUrls: string[];
  productId: string | mongoose.Schema.Types.ObjectId;
  colorId: string | mongoose.Schema.Types.ObjectId[];
  storeId: string | mongoose.Schema.Types.ObjectId;
}

const productImagesSchema: Schema<ProductImage> = new Schema(
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
      required: true,
    },
    colorId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Colors",
      },
    ],
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stores",
      required: true,
    },
  },
  { timestamps: true }
);

export const ProductImageModel =
  (models.ProductImages as mongoose.Model<ProductImage>) ||
  model<ProductImage>("ProductImages", productImagesSchema);
