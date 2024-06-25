import { NextRequest, NextResponse } from "next/server";
import { Connect } from "@/dbConfig/connect";

Connect();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        message: "Logout Successfuly",
        success: true,
      },
      { status: 200, headers: corsHeaders }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    NextResponse.json(
      { message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
