import mongoose, { Schema, model, models } from "mongoose";

interface Size extends Document {
  _id: string;
  name: string;
  value: string;
  storeId: mongoose.Schema.Types.ObjectId | string;
  createdAt: Date;
}

export interface SizeData {
  _id: string;
  name: string;
  value: string;
  storeId: mongoose.Schema.Types.ObjectId | string;
  createdAt: string;
}

const sizeSchema: Schema<Size> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stores",
      required: true,
    },
  },
  { timestamps: true }
);

export const SizeModel =
  (models.Sizes as mongoose.Model<Size>) || model<Size>("Sizes", sizeSchema);
