import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import UserModel from "@/models/user.model";
import { SendEmail } from "@/helpers/mailer";

Connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email } = reqBody;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const mailResponse = SendEmail({
      email,
      emailType: "RESET",
      userId: user._id,
    });
    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
