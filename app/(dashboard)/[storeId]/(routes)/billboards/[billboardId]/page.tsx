import FetchUser from "@/components/FetchUser";
import { BillboardData, BillboardModel } from "@/models/billboard.model";
import mongoose from "mongoose";
import { BillboardForm } from "./components/billboard-form";

const BillboardFormPage = async ({
  params,
}: {
  params: { billboardId: string; storeId: string };
}) => {
  let billboard: BillboardData = {
    _id: "",
    label: "",
    imageUrl: "",
    storeId: "",
    createdAt: new Date(),
  };

  if (mongoose.Types.ObjectId.isValid(params.billboardId)) {
    const foundBillboard = await BillboardModel.findOne({
      _id: params.billboardId,
    });
    console.log(foundBillboard);
    if (foundBillboard) {
      billboard = {
        _id: foundBillboard._id,
        label: foundBillboard.label,
        imageUrl: foundBillboard.imageUrl,
        storeId: foundBillboard.storeId,
        createdAt: foundBillboard.createdAt,
      };
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BillboardForm initialData={billboard} />
        </div>
      </div>
      <FetchUser />
    </>
  );
};

export default BillboardFormPage;
