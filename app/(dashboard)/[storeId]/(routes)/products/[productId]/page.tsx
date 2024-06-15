import FetchUser from "@/components/FetchUser";
import mongoose from "mongoose";
import { ProductData, ProductModel } from "@/models/product.model";
import { format } from "date-fns";
import { ProductForm } from "./components/product-form";
import { ColorData, ColorModel } from "@/models/color.model";
import { SizeData, SizeModel } from "@/models/size.model";
import { CategoryData, CategoryModel } from "@/models/category.model";

const BillboardFormPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  let colors: ColorData[] = [];
  let sizes: SizeData[] = [];
  let categories: CategoryData[] = [];

  let product: ProductData = {
    _id: "",
    name: "",
    price: 0,
    description: "",
    isFeatured: false,
    isArchived: false,
    productImageId: "",
    colorId: "",
    sizeId: "",
    categoryId: "",
    storeId: params.storeId,
    createdAt: "",
  };

  if (mongoose.Types.ObjectId.isValid(params.storeId)) {
    colors = await ColorModel.find({ storeId: params.storeId });
    sizes = await SizeModel.find({ storeId: params.storeId });
    categories = await CategoryModel.find({ storeId: params.storeId });
  }

  if (mongoose.Types.ObjectId.isValid(params.productId)) {
    const foundProduct = await ProductModel.findOne({
      _id: params.productId,
    });
    console.log(foundProduct);

    if (foundProduct) {
      product = {
        _id: foundProduct._id.toString(),
        name: foundProduct.name,
        price: foundProduct.price,
        description: foundProduct.description,
        isFeatured: foundProduct.isFeatured,
        isArchived: foundProduct.isArchived,
        productImageId: foundProduct.productImageId,
        colorId: foundProduct.colorId,
        sizeId: foundProduct.sizeId,
        categoryId: foundProduct.categoryId,
        storeId: foundProduct.storeId,
        createdAt: format(foundProduct.createdAt, "MMMM do, yy"),
      };
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductForm
            initialData={product}
            categories={categories}
            colors={colors}
          />
        </div>
      </div>
      <FetchUser />
    </>
  );
};

export default BillboardFormPage;
