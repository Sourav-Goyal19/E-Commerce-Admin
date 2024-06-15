import mongoose, { Document, Schema, model, models } from "mongoose";
import { SizeData } from "./size.model";
import { ColorData } from "./color.model";
import { ProductImageData } from "./productImage.model";
import { CategoryData } from "./category.model";

interface Product extends Document {
  name: string;
  price: number;
  description: string;
  isFeatured: boolean;
  isArchived: boolean;
  sizeId: string | mongoose.Schema.Types.ObjectId[];
  colorId: string | mongoose.Schema.Types.ObjectId[];
  productImageId: string | mongoose.Schema.Types.ObjectId[];
  categoryId: string | mongoose.Schema.Types.ObjectId;
  storeId: string | mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

export interface ProductData {
  _id: string;
  name: string;
  price: number;
  description: string;
  isFeatured: boolean;
  isArchived: boolean;
  sizeId: SizeData[];
  colorId: ColorData[];
  productImageId:
    | string
    | mongoose.Schema.Types.ObjectId[]
    | ProductImageData[];
  categoryId: CategoryData;
  storeId: string | mongoose.Schema.Types.ObjectId;
  createdAt: string;
}

const productSchema: Schema<Product> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      required: true,
    },
    isArchived: {
      type: Boolean,
      required: true,
    },
    sizeId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sizes",
      },
    ],
    colorId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Colors",
      },
    ],
    productImageId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductImages",
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stores",
    },
  },
  { timestamps: true }
);

export const ProductModel =
  (models.Products as mongoose.Model<Product>) ||
  model<Product>("Products", productSchema);
