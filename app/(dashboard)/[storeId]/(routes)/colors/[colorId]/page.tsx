import FetchUser from "@/components/FetchUser";
import mongoose from "mongoose";
import { format } from "date-fns";
import { ColorData, ColorModel } from "@/models/color.model";
import { ColorForm } from "./components/color-form";

const ColorFormPage = async ({
  params,
}: {
  params: { colorId: string; storeId: string };
}) => {
  let color: ColorData = {
    _id: "",
    name: "",
    value: "#000000",
    storeId: params.storeId,
    createdAt: "",
  };

  if (mongoose.Types.ObjectId.isValid(params.colorId)) {
    const foundColor = await ColorModel.findOne({
      _id: params.colorId,
    });
    if (foundColor) {
      color = {
        _id: foundColor._id.toString(),
        name: foundColor.name,
        value: foundColor.value,
        storeId: foundColor.storeId,
        createdAt: format(foundColor.createdAt, "MMMM do, yyyy"),
      };
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ColorForm initialData={color} />
        </div>
      </div>
      <FetchUser />
    </>
  );
};

export default ColorFormPage;
