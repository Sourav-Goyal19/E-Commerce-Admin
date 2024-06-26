import { NextRequest, NextResponse } from "next/server";
import UserModel, { User } from "@/models/user.model";
import { Connect } from "@/dbConfig/connect";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

Connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user: User | null = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log(user);

    if (user.type == "oauth") {
      return NextResponse.json(
        { message: "User Registered With Other Service" },
        { status: 401 }
      );
    }

    const isMatch = await bcryptjs.compare(password, user.hashedPassword!);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Email not verified" },
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
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    return response;
  } catch (error: any) {
    NextResponse.json({ message: error.message }, { status: 500 });
  }
}
