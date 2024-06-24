import mongoose, { Document, Model, Schema, model, models } from "mongoose";
import { CustomerData } from "./customer.model";

interface Address extends Document {
  _id: string;
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  nearby?: string;
  pincode: string;
  phone: string;
  customerId: string | mongoose.Schema.Types.ObjectId | CustomerData;
  createdAt: Date;
}

export interface AddressData {
  _id: string;
  name: string;
  email: string;
  street: string;
  city: string;
  pincode: string;
  state: string;
  nearby?: string;
  phone: string;
  customerId: string | mongoose.Schema.Types.ObjectId | CustomerData;
  createdAt: string;
}

const addressSchema: Schema<Address> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    },
  },
  { timestamps: true }
);

export const AddressModel =
  (models.Address as Model<Address>) ||
  model<Address>("Address", addressSchema);
