import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { Connect } from "@/dbConfig/connect";
import bcryptjs from "bcryptjs";
import { SendEmail } from "@/helpers/mailer";

Connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    // console.log(reqBody);

    if (!username || !email || !password)
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new UserModel({ username, email, hashedPassword, salt });
    const savedUser = await newUser.save();

    const emailResponse = await SendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser?._id,
    });

    // console.log(emailResponse);

    return NextResponse.json(
      {
        message: "User registered successfully",
        success: true,
        savedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
