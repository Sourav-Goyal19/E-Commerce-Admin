import FetchUser from "@/components/FetchUser";
import mongoose from "mongoose";
import { format } from "date-fns";
import { SizeData, SizeModel } from "@/models/size.model";
import { SizeForm } from "./components/size-form";

const SizesFormPage = async ({
  params,
}: {
  params: { sizeId: string; storeId: string };
}) => {
  let size: SizeData = {
    _id: "",
    name: "",
    value: "",
    storeId: params.storeId,
    createdAt: "",
  };

  if (mongoose.Types.ObjectId.isValid(params.sizeId)) {
    const foundSize = await SizeModel.findOne({
      _id: params.sizeId,
    });
    console.log(foundSize);
    if (foundSize) {
      size = {
        _id: foundSize._id.toString(),
        name: foundSize.name,
        value: foundSize.value,
        storeId: foundSize.storeId,
        createdAt: format(foundSize.createdAt, "MMMM do, yyyy"),
      };
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SizeForm initialData={size} />
        </div>
      </div>
      <FetchUser />
    </>
  );
};

export default SizesFormPage;
