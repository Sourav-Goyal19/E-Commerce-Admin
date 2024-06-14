import FetchUser from "@/components/FetchUser";
import { SizesClient } from "./components/client";
import { SizeColumn } from "./components/columns";
import { SizeData, SizeModel } from "@/models/size.model";
import { format } from "date-fns";
import mongoose from "mongoose";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  let formattedSizes: SizeColumn[] = [];
  if (mongoose.Types.ObjectId.isValid(params.storeId)) {
    const sizes = await SizeModel.find<SizeData>({ storeId: params.storeId })
      .populate("storeId")
      .sort({ createdAt: -1 });

    sizes.forEach((size) => {
      formattedSizes.push({
        id: size._id.toString(),
        name: size.name,
        value: size.value,
        createdAt: format(size.createdAt, "MMMM do, yy"),
      });
    });
  }
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes} />
      </div>
      <FetchUser />
    </div>
  );
};

export default SizesPage;
