import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";

Connect();

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        message: "Logout Successfuly",
        success: true,
      },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    });

    response.cookies.set("next-auth.session-token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    });

    return response;
  } catch (error: any) {
    NextResponse.json({ message: error.message }, { status: 500 });
  }
}
