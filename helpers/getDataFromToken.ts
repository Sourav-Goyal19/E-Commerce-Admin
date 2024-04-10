import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";

export async function getDataFromToken(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || "";
    // console.log("Next JS cookie", req.cookies.get("token"));
    // console.log(token);
    if (!token) return null;
    const jwtUser: any = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET as string
    );
    // console.log("JWT User", jwtUser);
    if (!jwtUser) return null;
    return jwtUser.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
