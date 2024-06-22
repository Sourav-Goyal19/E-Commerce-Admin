import mongoose, { Document, Model, model, models } from "mongoose";
import { CustomerData } from "./customer.model";
import { ProductData } from "./product.model";

interface Cart extends Document {
  customerId: string | mongoose.Schema.Types.ObjectId | CustomerData;
  productId: string[] | mongoose.Schema.Types.ObjectId[] | ProductData[];
  quantity: number;
}

export interface CartData {
  _id: string;
  customerId: string | mongoose.Schema.Types.ObjectId | CustomerData;
  productId: string[] | mongoose.Schema.Types.ObjectId[] | ProductData[];
  quantity: number;
}

const cartSchema = new mongoose.Schema<Cart>({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    required: true,
  },
  productId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  quantity: {
    type: Number,
  },
});

export const CartModel =
  (models.Cart as Model<Cart>) || model<Cart>("Cart", cartSchema);
