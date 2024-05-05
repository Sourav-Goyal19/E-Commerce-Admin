import { Connect } from "@/dbConfig/connect";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

Connect();

interface IParams {
  email: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: IParams }
) {
  const email = params.email;
  const user = await UserModel.findOne({ email })
    .select("-type")
    .select("-provider");

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(
    {
      message: "User Found Successfully",
      success: true,
      user,
    },
    { status: 200 }
  );
}
