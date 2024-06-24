import { Connect } from "@/dbConfig/connect";
import { AddressModel } from "@/models/address.model";
import { NextRequest, NextResponse } from "next/server";

Connect();

export const GET = async (req: NextRequest) => {
  const addresses = await AddressModel.find();
  return NextResponse.json(addresses);
};
