import FetchUser from "@/components/FetchUser";
import { BillboardClient } from "./components/client";
import { BillboardModel } from "@/models/billboard.model";
import { format } from "date-fns";
import mongoose from "mongoose";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  let billboards = null;
  if (mongoose.Types.ObjectId.isValid(params.storeId)) {
    billboards = await BillboardModel.find({
      storeId: params.storeId,
    }).sort({ createdAt: -1 });

    billboards = billboards.map((billboard) => ({
      id: billboard._id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
    }));
  }
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={billboards} />
      </div>
      <FetchUser />
    </div>
  );
};

export default BillboardsPage;
