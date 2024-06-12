import { Connect } from "@/dbConfig/connect";
import { StoreModel } from "@/models/store.model";
import { NextRequest, NextResponse } from "next/server";

Connect();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { name, userId } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!params.storeId) {
      return NextResponse.json(
        { message: "Store id is required" },
        { status: 400 }
      );
    }

    const store = await StoreModel.findByIdAndUpdate(
      params.storeId,
      {
        name,
      },
      { new: true }
    );

    return NextResponse.json({
      message: "Store Updated Successfully",
      store,
    });
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return NextResponse.json(
        { message: "Store id is required" },
        { status: 400 }
      );
    }

    const deletedStore = await StoreModel.findByIdAndDelete(params.storeId);

    return NextResponse.json({
      message: "Store Deleted Successfully",
    });
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
