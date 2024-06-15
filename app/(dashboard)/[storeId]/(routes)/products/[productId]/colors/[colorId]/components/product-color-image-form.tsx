"use client";

import axios from "axios";
import { AlertModal } from "@/components/modals/alert";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ProductImageData } from "@/models/productImage.model";
import { SizeData } from "@/models/size.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ui/image-upload";

interface ProductColorImagesFormProps {
  productImages: ProductImageData;
  size: SizeData;
  colorId: string;
  allSizes: SizeData[];
}

const formSchema = z.object({
  images: z.string().array(),
  sizeId: z.string().min(1, "Size is required"),
});

type ProductImageFormValues = z.infer<typeof formSchema>;

export const ProductColorImagesForm: React.FC<ProductColorImagesFormProps> = ({
  productImages,
  size,
  colorId,
  allSizes,
}) => {
  const params = useParams();
  const router = useRouter();

  const title = colorId !== "" ? "Edit Product Images" : "Add Product Images";
  const description =
    colorId !== "" ? "Edit product images" : "Add new product images";
  const action = colorId !== "" ? "Save Changes" : "Create";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductImageFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: productImages.imageUrls,
      sizeId: size._id,
    },
  });

  const onSubmit = (data: ProductImageFormValues) => {
    setLoading(true);
    if (colorId !== "") {
      axios
        .patch(`/api/products/${params.billboardId}`, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          router.push(`/${params.storeId}/products`);
          toast.success(res.data.message);
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
        .post(`/api/products/${params.storeId}`, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          router.push(`/${params.storeId}/products`);
          toast.success(res.data.message);
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

  const onDelete = () => {
    setLoading(true);
    axios
      .delete(`/api/products/${params.billboardId}`)
      .then((res) => {
        router.push(`/${params.storeId}/products`);
        toast.success(res.data.message);
        router.refresh();
      })
      .catch((err) => {
        toast.error(err.response.data.message || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
        setOpen(false);
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
        {colorId !== "" && (
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
          </div>
          <Button type="submit" disabled={loading}>
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
