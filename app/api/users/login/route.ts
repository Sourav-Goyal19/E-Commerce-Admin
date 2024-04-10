import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { Connect } from "@/dbConfig/connect";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

Connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(user);

    const isMatch = await bcryptjs.compare(password, user.hashedPassword);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        user,
      },
      { status: 200 }
    );

    const jwtUser = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(
      jwtUser,
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    NextResponse.json({ error: error.message }, { status: 500 });
  }
}
