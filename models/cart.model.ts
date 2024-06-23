import mongoose, { Document, Model, model, models } from "mongoose";
import { CustomerData } from "./customer.model";
import { ProductData } from "./product.model";

export interface CartProduct {
  productId: string | mongoose.Schema.Types.ObjectId | ProductData;
  quantity: number;
  colorId: string | mongoose.Schema.Types.ObjectId;
  sizeId: string | mongoose.Schema.Types.ObjectId;
}

interface Cart extends Document {
  customerId: string | mongoose.Schema.Types.ObjectId | CustomerData;
  products: CartProduct[];
  quantity: number;
}

export interface CartData {
  _id: string;
  customerId: string | mongoose.Schema.Types.ObjectId | CustomerData;
  products: CartProduct[];
  quantity: number;
}

const cartSchema = new mongoose.Schema<Cart>({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      colorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Colors",
        required: true,
      },
      sizeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sizes",
        required: true,
      },
    },
  ],
  quantity: {
    type: Number,
  },
});

export const CartModel =
  (models.Cart as Model<Cart>) || model<Cart>("Cart", cartSchema);
