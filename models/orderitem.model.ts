import mongoose, { Model, Schema, model, models } from "mongoose";
import { ProductData } from "./product.model";

interface OrderItem extends Document {
  _id: string;
  orderId: string | mongoose.Schema.Types.ObjectId;
  productId: string | mongoose.Schema.Types.ObjectId;
}

export interface OrderItemData {
  _id: string;
  orderId: string;
  productId: string | ProductData;
}

const orderItemSchema: Schema<OrderItem> = new Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
  },
  { timestamps: true }
);

export const OrderItemModel =
  (models.Orderitems as Model<OrderItem>) ||
  model<OrderItem>("Orderitems", orderItemSchema);
