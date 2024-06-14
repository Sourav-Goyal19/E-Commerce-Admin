import { Document, models } from "mongoose";
import mongoose, { Schema, model } from "mongoose";

export interface Store extends Document {
  name: string;
  userId: Schema.Types.ObjectId;
  billboards: Schema.Types.ObjectId[];
  categories: Schema.Types.ObjectId[];
}
export interface StoreData {
  _id: string;
  name: string;
  userId: Schema.Types.ObjectId;
  billboards: Schema.Types.ObjectId[];
  categories: Schema.Types.ObjectId[];
}

const StoreSchema: Schema<Store> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    billboards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Billboards",
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

export const StoreModel =
  (models.Stores as mongoose.Model<Store>) ||
  model<Store>("Stores", StoreSchema);
