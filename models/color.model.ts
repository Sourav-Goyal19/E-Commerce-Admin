import mongoose, { Schema, model, models } from "mongoose";

interface Color extends Document {
  _id: string;
  name: string;
  value: string;
  storeId: mongoose.Schema.Types.ObjectId | string;
  createdAt: Date;
}

export interface ColorData {
  _id: string;
  name: string;
  value: string;
  storeId: mongoose.Schema.Types.ObjectId | string;
  createdAt: string;
}

const colorSchema: Schema<Color> = new Schema(
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

export const ColorModel =
  (models.Colors as mongoose.Model<Color>) ||
  model<Color>("Colors", colorSchema);
