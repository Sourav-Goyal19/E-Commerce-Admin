import { Connect } from "@/dbConfig/connect";
import { StoreModel } from "@/models/store.modal";
import { NextRequest, NextResponse } from "next/server";

Connect();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, userId } = body;

  try {
    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const store = await StoreModel.create({
      name,
      userId,
    });

    return NextResponse.json(
      { message: "Store Created", store: store },
      { status: 201 }
    );
  } catch (error: any) {
    console.log("STORE[POST]", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
