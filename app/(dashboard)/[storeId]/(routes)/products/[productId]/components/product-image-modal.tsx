"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ColorData } from "@/models/color.model";
import { ProductImageData } from "@/models/productImage.model";
import { SizeData } from "@/models/size.model";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ProductImageModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  color?: ColorData;
  allSizes: SizeData[];
  productImages?: ProductImageData | null;
  size?: SizeData;
  colors: ColorData[];
  setSelectedColorWithImages: React.Dispatch<
    React.SetStateAction<ProductImageData[]>
  >;
  setalreadySelectedColor: React.Dispatch<React.SetStateAction<string[]>>;
  storeId: string;
}

const formSchema = z.object({
  images: z.string().array(),
  sizeId: z.string().min(1, "Size is required"),
  colorId: z.string().min(1, "Color is required"),
});

type ProductImageFormValues = z.infer<typeof formSchema>;

export const ProductImageModal: React.FC<ProductImageModalProps> = ({
  title,
  isOpen,
  onClose,
  color,
  allSizes,
  productImages,
  size,
  colors,
  storeId,
  setSelectedColorWithImages,
  setalreadySelectedColor,
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductImageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: productImages ? productImages.imageUrls : [],
      sizeId: size?._id || "",
      colorId: color?._id || "",
    },
  });

  const onSubmit = (data: ProductImageFormValues) => {
    console.log(data);
    setLoading(true);
    if (!color?._id) {
      axios
        .post(`/api/productimages/${storeId}`, {
          imageUrls: data.images,
          colorId: data.colorId,
          sizeId: data.sizeId,
        })
        .then((res) => {
          console.log(res.data);
          const productImage: ProductImageData = res.data.productImage;
          setSelectedColorWithImages((prev) => [
            ...prev,
            {
              colorId: productImage.colorId,
              sizeId: productImage.sizeId,
              imageUrls: productImage.imageUrls,
              _id: productImage._id,
              storeId: productImage.storeId,
            },
          ]);
          setalreadySelectedColor((prev) => [
            ...prev,
            productImage.colorId.toString(),
          ]);
          form.reset();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
          onClose();
        });
    }
  };

  return (
    <div className={cn(isOpen ? "block" : "hidden")}>
      <Heading title="Add Images" />
      <Separator className="mt-2" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 py-4">
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.length > 0 &&
                        colors.map((color) => (
                          <SelectItem key={color._id} value={color._id}>
                            {color.name}
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
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allSizes.length > 0 &&
                        allSizes.map((size) => (
                          <SelectItem key={size._id} value={size._id}>
                            {size.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.map((imageUrl) => imageUrl != url),
                      ])
                    }
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            Done
          </Button>
        </form>
      </Form>
      <Separator className="mt-2" />
    </div>
  );
};
