import mongoose, { Document, Model, Schema, model, models } from "mongoose";
import { CustomerData } from "./customer.model";

interface Address extends Document {
  _id: string;
  street: string;
  city: string;
  country: string;
  zip: string;
  phone: string;
  customerId: string | mongoose.Schema.Types.ObjectId | CustomerData;
  createdAt: Date;
}

export interface AddressData {
  _id: string;
  street: string;
  city: string;
  country: string;
  zip: string;
  phone: string;
  customerId: string | mongoose.Schema.Types.ObjectId | CustomerData;
  createdAt: string;
}

const addressSchema: Schema<Address> = new Schema(
  {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "India",
    },
    zip: {
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
