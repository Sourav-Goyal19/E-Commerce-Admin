import mongoose, { Model, Schema, model, models } from "mongoose";
import { OrderItemData } from "./orderitem.model";

interface Order extends Document {
  _id: string;
  storeId: string | mongoose.Schema.Types.ObjectId;
  orderItems: string[] | mongoose.Schema.Types.ObjectId[] | OrderItemData[];
  isPaid: boolean;
  phone: string;
  address: string;
  createdAt: Date;
}

export interface OrderData {
  _id: string;
  storeId: string | mongoose.Schema.Types.ObjectId;
  isPaid: boolean;
  phone: string;
  address: string;
  orderItems: string[] | mongoose.Schema.Types.ObjectId[] | OrderItemData[];
}

const orderSchema: Schema<Order> = new Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stores",
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orderitems",
      },
    ],
    isPaid: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const OrderModel =
  (models.Orders as Model<Order>) || model<Order>("Orders", orderSchema);
