"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
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
import { CategoryData } from "@/models/category.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BillboardData } from "@/models/billboard.model";
import { Trash } from "lucide-react";

interface CategoryFormProps {
  initialData: CategoryData;
  billboards: BillboardData[];
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  billboardId: z.string().min(1, "Billboard is required"),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams();
  const router = useRouter();

  const title = initialData._id ? "Edit Category" : "Create Category";
  const description = initialData._id
    ? "Edit a category"
    : "Add a new category";
  const action = initialData._id ? "Save Changes" : "Create";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      billboardId: (initialData?.billboardId as string) || "",
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    setLoading(true);
    if (initialData._id == "") {
      axios
        .post(`/api/categories/${params.storeId}`, data)
        .then((res) => {
          router.push(`/${params.storeId}/categories`);
          toast.success(res.data.message);
          router.refresh();
        })
        .catch((err) => {
          toast.error(err.response?.data.message || "Something went wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      axios
        .patch(`/api/categories/${params.categoryId}`, data)
        .then((res) => {
          router.push(`/${params.storeId}/categories`);
          toast.success(res.data.message);
          router.refresh();
        })
        .catch((err) => {
          toast.error(err.response?.data.message || "Something went wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const onDelete = () => {
    setLoading(true);
    axios
      .delete(`/api/categories/${params.categoryId}`)
      .then((res) => {
        router.push(`/${params.storeId}/categories`);
        toast.success(res.data.message);
        router.refresh();
      })
      .catch((err) => {
        toast.error(err.response?.data.message || "Something went wrong");
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
        {initialData._id && (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Category Name"
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
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a billboard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.length > 0 &&
                        billboards.map((billboard) => (
                          <SelectItem key={billboard._id} value={billboard._id}>
                            {billboard.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
