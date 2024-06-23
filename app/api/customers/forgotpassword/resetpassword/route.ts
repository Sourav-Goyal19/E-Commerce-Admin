import { Connect } from "@/dbConfig/connect";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { CustomerModel } from "@/models/customer.model";
Connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { customerId, password } = reqBody;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      customerId,
      {
        $set: { hashedPassword, salt },
        $unset: { forgotPasswordOtp: 1, forgotPasswordOtpExpiry: 1 },
      },
      { new: true }
    );
    console.log(updatedCustomer);
    if (!updatedCustomer) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}