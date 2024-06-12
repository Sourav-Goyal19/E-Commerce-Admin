import { Document, models } from "mongoose";
import mongoose, { Schema, model } from "mongoose";

export interface Store extends Document {
  name: string;
  userId: Schema.Types.ObjectId;
  billboards: Schema.Types.ObjectId[];
}
export interface StoreData {
  _id: string;
  name: string;
  userId: Schema.Types.ObjectId;
  billboards: Schema.Types.ObjectId[];
}

const StoreSchema: Schema<Store> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    billboards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "billboards",
      },
    ],
  },
  { timestamps: true }
);

export const StoreModel =
  (models.store as mongoose.Model<Store>) || model<Store>("store", StoreSchema);
