import FetchUser from "@/components/FetchUser";
import { format } from "date-fns";
import mongoose from "mongoose";
import { ProductData, ProductModel } from "@/models/product.model";
import { ProductClient } from "./components/client";
import { ProductColoumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  let formattedProducts: ProductColoumn[] = [];
  if (mongoose.Types.ObjectId.isValid(params.storeId)) {
    const products = await ProductModel.find<ProductData>({
      storeId: params.storeId,
    })
      .sort({ createdAt: -1 })
      .populate("categoryId", "sizeId", "colorId");

    console.log(products);

    products.forEach((product) => {
      formattedProducts.push({
        id: product._id.toString(),
        name: product.name,
        price: formatter.format(product.price),
        isFeatured: product.isFeatured,
        isArchived: product.isArchived,
        //@ts-ignore
        size: product.sizeId[0].name,
        //@ts-ignore
        color: product.colorId[0].name,
        //@ts-ignore
        category: product.categoryId.name,
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
