import mongoose, { Document, Model, Schema, model, models } from "mongoose";
import { AddressData } from "./address.model";
import { CartData } from "./cart.model";

interface Customer extends Document {
  name: string;
  email: string;
  phone: string;
  salt: string;
  hashedPassword: string;
  isVerified: boolean;
  verificationCode: string | undefined;
  verificationCodeExpiry: Date | undefined;
  forgotPasswordOtp: string | undefined;
  forgotPasswordOtpExpiry: Date | undefined;
  address: string[] | mongoose.Schema.Types.ObjectId[] | AddressData[];
  cart: string | mongoose.Schema.Types.ObjectId | CartData;
  createdAt: Date;
}

export interface CustomerData {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  salt: string;
  hashedPassword: string;
  phone: string;
  verificationCode: string | undefined;
  verificationCodeExpiry: Date | undefined;
  forgotPasswordOtp: string | undefined;
  forgotPasswordOtpExpiry: Date | undefined;
  address: string[] | mongoose.Schema.Types.ObjectId[] | AddressData[];
  cart: string | mongoose.Schema.Types.ObjectId | CartData;
  createdAt: string;
}

const customerSchema: Schema<Customer> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
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
    },
    hashedPassword: {
      type: String,
    },
  },
  { timestamps: true }
);

export const CustomerModel =
  (models.Customers as Model<Customer>) ||
  model<Customer>("Customers", customerSchema);
