import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";
import UserModel, { UserData } from "@/models/user.model";
import { getDataFromToken } from "@/helpers/getDataFromToken";

Connect();

export async function GET(req: NextRequest) {
  try {
    const userId = await getDataFromToken(req);
    // console.log(userId);
    const user: UserData = await UserModel.findById(userId)
      .select("-hashedPassword")
      .select("-salt")
      .select("-__v");
    // console.log(user);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        message: "User Found",
        user: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
