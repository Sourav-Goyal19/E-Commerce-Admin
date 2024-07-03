import mongoose, { Document, Model, Schema, model, models } from "mongoose";
import { AddressData } from "./address.model";
import { CartData } from "./cart.model";

interface Customer extends Document {
  name: string;
  phone: string;
  salt: string;
  hashedPassword: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiry?: Date;
  forgotPasswordOtp?: string;
  forgotPasswordOtpExpiry?: Date;
  address: mongoose.Schema.Types.ObjectId[] | AddressData[];
  cart: mongoose.Schema.Types.ObjectId | CartData;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerData {
  _id: string;
  name: string;
  phone: string;
  salt: string;
  hashedPassword: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiry?: Date;
  forgotPasswordOtp?: string;
  forgotPasswordOtpExpiry?: Date;
  address: mongoose.Schema.Types.ObjectId[] | AddressData[];
  cart: mongoose.Schema.Types.ObjectId | CartData;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema: Schema<Customer> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpiry: {
      type: Date,
    },
    forgotPasswordOtp: {
      type: String,
    },
    forgotPasswordOtpExpiry: {
      type: Date,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    salt: {
      type: String,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const CustomerModel =
  (models.Customers as Model<Customer>) ||
  model<Customer>("Customers", customerSchema);
