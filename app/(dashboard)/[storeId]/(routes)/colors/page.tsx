import FetchUser from "@/components/FetchUser";
import { ColorsClient } from "./components/client";
import { ColorColumn } from "./components/columns";
import { format } from "date-fns";
import { ColorData, ColorModel } from "@/models/color.model";
import mongoose from "mongoose";

const ColorPage = async ({ params }: { params: { storeId: string } }) => {
  let formattedColors: ColorColumn[] = [];
  if (mongoose.Types.ObjectId.isValid(params.storeId)) {
    const colors = await ColorModel.find<ColorData>({ storeId: params.storeId })
      .populate("storeId")
      .sort({ createdAt: -1 });

    colors.forEach((color) => {
      formattedColors.push({
        id: color._id.toString(),
        name: color.name,
        value: color.value,
        createdAt: format(color.createdAt, "MMMM do, yy"),
      });
    });
  }
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formattedColors} />
      </div>
      <FetchUser />
    </div>
  );
};

export default ColorPage;
