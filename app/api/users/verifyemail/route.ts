import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { Connect } from "@/dbConfig/connect";

Connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;
    // console.log(token, "token");
    const user = await UserModel.findOne({
      verifyToken: token as string,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    // console.log("🚀 ~ GET ~ u̥ser:", user);

    if (!user) {
      return NextResponse.json(
        {
          message: "Token is invalid",
        },
        { status: 400 }
      );
    }

    // console.log(user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Email Verified Successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
