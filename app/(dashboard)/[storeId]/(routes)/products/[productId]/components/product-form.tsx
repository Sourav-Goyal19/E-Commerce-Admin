"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useParams, useRouter } from "next/navigation";
import { Plus, Trash, X } from "lucide-react";
import { ProductData } from "@/models/product.model";
import { ColorData } from "@/models/color.model";
import { SizeData } from "@/models/size.model";
import { CategoryData } from "@/models/category.model";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductImageData } from "@/models/productImage.model";
import { CellAction } from "./product-image-cell-action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductImageModal } from "./product-image-modal";

interface ProductFormProps {
  initialData: ProductData;
  colors: ColorData[];
  sizes: SizeData[];
  categories: CategoryData[];
  productImages: ProductImageData[];
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(1, { message: "Proper price is required" }),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
});

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  colors,
  categories,
  sizes,
  productImages,
}) => {
  const params = useParams();
  const router = useRouter();

  const title = initialData._id !== "" ? "Edit Product" : "Create Product";
  const description =
    initialData._id !== "" ? "Edit a product" : "Add a new product";
  const action = initialData._id !== "" ? "Save Changes" : "Create Product";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [alreadySelectedColor, setalreadySelectedColor] = useState<string[]>(
    []
  );
  const [selectedColorWithImages, setSelectedColorWithImages] = useState<
    ProductImageData[]
  >([]);
  const [selectedSize, setSelectedSize] = useState<string[]>([]);

  const [selectedImages, setSelectedImages] = useState<ProductImageData>();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      categoryId: initialData.categoryId as string,
    },
  });

  const handleProductImageUpdate = (id: string) => {
    const productImage = selectedColorWithImages.find(
      (productImage) => productImage._id == id
    );
    console.log(productImage);
    if (productImage) {
      setSelectedImages(productImage);
      setIsOpen(true);
    }
  };

  const handleProductImageDelete = (id: string) => {
    const deleteProductImage = selectedColorWithImages.find(
      (productImage) => productImage._id == id
    );
    if (deleteProductImage) {
      setSelectedColorWithImages((prev) =>
        prev.filter(
          (productImage) => productImage._id != deleteProductImage._id
        )
      );
      setalreadySelectedColor((prev) =>
        prev.filter((color) => color != deleteProductImage.colorId)
      );
    }
  };

  const onSubmit = (data: ProductFormValues) => {
    setLoading(true);
    console.log(data);
    if (selectedColorWithImages.length <= 0) {
      setLoading(false);
      return toast.error("Product Images are required");
    }
    if (initialData._id == "") {
      axios
        .post(`/api/products/${params.storeId}`, {
          name: data.name,
          price: data.price,
          description: data.description,
          isFeatured: data.isFeatured,
          isArchived: data.isArchived,
          categoryId: data.categoryId,
          productImages: selectedColorWithImages,
          sizeId: selectedSize,
          colorId: alreadySelectedColor,
        })
        .then((res) => {
          toast.success(res.data.message);
          router.push(`/${params.storeId}/products`);
          router.refresh();
        })
        .catch((err) => {
          toast.error(err.response.data.message || "Something went wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      axios
        .patch(`/api/products/${initialData._id}`, {
          name: data.name,
          price: data.price,
          description: data.description,
          isFeatured: data.isFeatured,
          isArchived: data.isArchived,
          categoryId: data.categoryId,
          productImages: selectedColorWithImages,
          sizeId: selectedSize,
          colorId: alreadySelectedColor,
        })
        .then((res) => {
          toast.success(res.data.message);
          router.push(`/${params.storeId}/products`);
          router.refresh();
        })
        .catch((err) => {
          toast.error(err.response.data.message || "Something went wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (initialData._id) {
      setSelectedColorWithImages(productImages);
      setSelectedSize(initialData.sizeId as string[]);
      setalreadySelectedColor(initialData.colorId as string[]);
    }
  }, []);

  const onDelete = () => {
    setLoading(true);
    axios
      .delete(`/api/products/${initialData._id}`)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
        setIsOpen(false);
      });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex justify-between items-center">
        <Heading title={title} description={description} />
        {initialData._id !== "" && (
          <Button
            variant="destructive"
            size="icon"
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Trash</span>
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product Name"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Product Price"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Product description"
                      className="custom-scroll"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={field.value == "" && "Select a Category"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.length > 0 &&
                        categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This Product will appear on the home page
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This Product will not appear in the store
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsOpen(!isOpen);
                setSelectedImages(undefined);
              }}
              disabled={alreadySelectedColor.length === colors.length}
            >
              {isOpen ? (
                <>
                  <X className="mr-2 w-4 h-4" />
                  Close
                </>
              ) : (
                <>
                  <Plus className="mr-2 w-4 h-4" />
                  Add Images
                </>
              )}
            </Button>
          </div>
          <Button
            onClick={() => form.trigger()}
            type="submit"
            disabled={loading}
          >
            {action}
          </Button>
        </form>
      </Form>
      <ProductImageModal
        title="Add Details"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        colors={
          selectedImages?._id
            ? [
                ...colors.filter(
                  (color) => !alreadySelectedColor.includes(color._id)
                ),
                colors.find(
                  (color) => color._id == selectedImages.colorId
                ) as ColorData,
              ].filter(Boolean)
            : colors.filter(
                (color) => !alreadySelectedColor.includes(color._id)
              )
        }
        sizes={sizes}
        productImage={selectedImages}
        setSelectedColorWithImages={setSelectedColorWithImages}
        storeId={params.storeId.toString()}
        setalreadySelectedColor={setalreadySelectedColor}
        setSelectedSize={setSelectedSize}
      />

      {selectedColorWithImages.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Images</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedColorWithImages.map((image) => (
              <TableRow>
                <TableCell>{image.imageUrls.length}</TableCell>
                <TableCell>
                  {colors.find((color) => color._id == image.colorId)?.name}
                </TableCell>
                <TableCell>
                  {sizes.find((size) => size._id == image.sizeId)?.name}
                </TableCell>
                <TableCell>
                  <CellAction
                    productImageId={image._id.toString()}
                    handleProductImageUpdate={handleProductImageUpdate}
                    handleProductImageDelete={handleProductImageDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};
