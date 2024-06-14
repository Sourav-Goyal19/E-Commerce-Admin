import FetchUser from "@/components/FetchUser";
import { CategoryClient } from "./components/client";
import { format } from "date-fns";
import mongoose from "mongoose";
import { CategoryData, CategoryModel } from "@/models/category.model";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  let formattedCategories: CategoryColumn[] = [];
  if (mongoose.Types.ObjectId.isValid(params.storeId)) {
    const categories = await CategoryModel.find<CategoryData>({
      storeId: params.storeId,
    })
      .populate("billboardId")
      .sort({ createdAt: -1 });

    categories.forEach((category) => {
      formattedCategories.push({
        id: category._id.toString(),
        name: category.name,
        //@ts-ignore
        billboardLabel: category.billboardId.label,
        createdAt: format(category.createdAt, "MMMM do, yyyy"),
      });
    });
  }
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
      <FetchUser />
    </div>
  );
};

export default CategoriesPage;
