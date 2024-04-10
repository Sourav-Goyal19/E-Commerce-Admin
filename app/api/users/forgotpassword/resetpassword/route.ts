import { Connect } from "@/dbConfig/connect";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
Connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { userId, password } = reqBody;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: { hashedPassword, salt },
        $unset: { forgotPasswordToken: 1, forgotPasswordTokenExpiry: 1 },
      },
      { new: true }
    );
    console.log(updatedUser);
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
