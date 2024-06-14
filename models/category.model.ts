import mongoose, { Document, Schema, model, models, Model } from "mongoose";

interface Category extends Document {
  name: string;
  storeId: mongoose.Schema.Types.ObjectId | string;
  billboardId: mongoose.Schema.Types.ObjectId | string;
  createdAt: Date;
}

export interface CategoryData {
  _id: string;
  name: string;
  storeId: mongoose.Schema.Types.ObjectId | string;
  billboardId:
    | string
    | mongoose.Schema.Types.ObjectId
    | {
        label: string;
        imageUrl: string;
        storeId: string;
      };
  createdAt: string;
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stores",
    },
    billboardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Billboards",
    },
  },
  { timestamps: true }
);

const CategoryModel: Model<Category> =
  models.Category || model<Category>("Category", categorySchema);

export { CategoryModel };
