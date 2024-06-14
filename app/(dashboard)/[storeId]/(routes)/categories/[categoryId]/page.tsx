import FetchUser from "@/components/FetchUser";
import mongoose from "mongoose";
import { CategoryData, CategoryModel } from "@/models/category.model";
import { CategoryForm } from "./components/category-form";
import { format } from "date-fns";
import { BillboardModel } from "@/models/billboard.model";

const CategoriesFormPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  let category: CategoryData = {
    _id: "",
    name: "",
    storeId: params.storeId,
    createdAt: "",
    billboardId: "",
  };

  const billboards = await BillboardModel.find({
    storeId: params.storeId,
  });

  if (mongoose.Types.ObjectId.isValid(params.categoryId)) {
    const foundCategory = await CategoryModel.findOne({
      _id: params.categoryId,
    });
    console.log(foundCategory);
    if (foundCategory) {
      category = {
        _id: foundCategory._id.toString(),
        name: foundCategory.name,
        storeId: foundCategory.storeId,
        billboardId: foundCategory.billboardId,
        createdAt: format(foundCategory.createdAt, "MMMM do, yyyy"),
      };
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CategoryForm initialData={category} billboards={billboards} />
        </div>
      </div>
      <FetchUser />
    </>
  );
};

export default CategoriesFormPage;
