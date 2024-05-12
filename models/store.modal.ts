import { Document, models } from "mongoose";
import mongoose, { Schema, model } from "mongoose";

export interface Store extends Document {
  name: string;
  userId: Schema.Types.ObjectId;
}
export interface StoreData {
  name: string;
  userId: Schema.Types.ObjectId;
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
  },
  { timestamps: true }
);

export const StoreModel =
  (models.store as mongoose.Model<Store>) || model<Store>("store", StoreSchema);
