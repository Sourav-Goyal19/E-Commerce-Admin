import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import UserModel from "@/models/user.model";

Connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;

    // console.log(token);

    const user = await UserModel.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    // console.log(user);

    if (!user) {
      return NextResponse.json(
        {
          message: "Token has expired",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Token is valid", user },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
