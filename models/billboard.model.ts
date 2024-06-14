import mongoose from "mongoose";
import { Document, Schema, model, models } from "mongoose";

interface Billboard extends Document {
  label: string;
  imageUrl: string;
  storeId: Schema.Types.ObjectId;
  createdAt: Date;
}

export interface BillboardData {
  _id: string;
  label: string;
  imageUrl: string;
  storeId: Schema.Types.ObjectId | string;
  createdAt: Date;
}

const BillboardSchema = new Schema<Billboard>(
  {
    label: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Stores",
      required: true,
    },
  },
  { timestamps: true }
);

export const BillboardModel =
  (models.Billboards as mongoose.Model<Billboard>) ||
  model<Billboard>("Billboards", BillboardSchema);
