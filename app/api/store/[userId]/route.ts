import { Connect } from "@/dbConfig/connect";
import { StoreModel } from "@/models/store.modal";
import { NextRequest, NextResponse } from "next/server";

Connect();

interface Params {
  userId: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const userId = params.userId;
    if (!userId) {
      return NextResponse.json(
        { message: "UserId is required" },
        { status: 400 }
      );
    }

    const store = await StoreModel.find({ userId: userId });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Store found", stores: store },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Some Internal Error has occured" },
      { status: 500 }
    );
  }
}
