import mongoose from "mongoose";
import { Connect } from "@/dbConfig/connect";
import { NextRequest, NextResponse } from "next/server";
import { AddressModel } from "@/models/address.model";
import { CustomerModel } from "@/models/customer.model";

Connect();

const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    name,
    email,
    phone,
    street,
    city,
    state,
    pincode,
    nearby,
    customerId,
  } = body;

  console.log(nearby);

  if (!name || !email || !phone || !street || !city || !state || !pincode) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!customerId) {
    return NextResponse.json(
      { message: "Customer ID is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return NextResponse.json(
      { message: "Invalid customer ID" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const existingAddress = await AddressModel.findOne({
      $and: [
        customerId,
        name,
        email,
        phone,
        street,
        city,
        state,
        pincode,
        nearby,
      ],
    });

    if (existingAddress) {
      return NextResponse.json(
        { message: "Address already exists" },
        { status: 400, headers: corsHeaders }
      );
    }

    const newAddress = await AddressModel.create({
      name,
      email,
      phone,
      street,
      city,
      state,
      pincode,
      nearby,
      customerId,
    });

    await CustomerModel.findByIdAndUpdate(customerId, {
      $push: { address: newAddress._id },
    });

    return NextResponse.json(
      { message: "Address created successfully" },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.log("ADDRESS[POST]:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
};
