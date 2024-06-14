import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import { SendEmail } from "@/helpers/mailer";
import UserModel from "@/models/user.model";

Connect();

export async function POST(req: NextRequest) {
  try {
    // console.log("Calling");
    const reqBody = await req.json();
    const { email } = reqBody;
    const user = await UserModel.findOne({ email });
    // console.log("User", user);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "User already verified" },
        { status: 400 }
      );
    }

    const mailResponse = await SendEmail({
      email,
      emailType: "VERIFY",
      userId: user._id,
    });

    // console.log("MailResponse", mailResponse);

    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
