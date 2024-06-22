import FetchUser from "@/components/FetchUser";
import { format } from "date-fns";
import mongoose from "mongoose";
import { ProductData, ProductModel } from "@/models/product.model";
import { ProductClient } from "./components/client";
import { ProductColoumn } from "./components/columns";
import { formatter } from "@/lib/utils";
import { CategoryData } from "@/models/category.model";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  let formattedProducts: ProductColoumn[] = [];
  if (mongoose.Types.ObjectId.isValid(params.storeId)) {
    const products = await ProductModel.find<ProductData>({
      storeId: params.storeId,
    })
      .populate("categoryId")
      .sort({ createdAt: -1 });

    products.forEach((product) => {
      formattedProducts.push({
        id: product._id.toString(),
        name: product.name,
        price: formatter.format(product.price),
        isFeatured: product.isFeatured,
        isArchived: product.isArchived,
        sizes: product.sizeId.length,
        colors: product.colorId.length,
        category: (product.categoryId as CategoryData).name,
        createdAt: format(product.createdAt, "MMMM dd, yyyy"),
      });
    });
  }
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
      <FetchUser />
    </div>
  );
};

export default ProductsPage;
