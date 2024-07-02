"use client";

import React, { useState } from "react";
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
import { Trash } from "lucide-react";
import { BillboardData } from "@/models/billboard.model";
import ImageUpload from "@/components/ui/image-upload";

interface BillboardFormProps {
  initialData: BillboardData;
}

const formSchema = z.object({
  label: z.string().min(1, "Name is required"),
  imageUrl: z.string().min(1, "Image is required"),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();

  const title = initialData._id !== "" ? "Edit billboard" : "Create billboard";
  const description =
    initialData._id !== "" ? "Edit a billboard" : "Add a new billboard";
  const action = initialData._id !== "" ? "Save Changes" : "Create";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: BillboardFormValues) => {
    setLoading(true);
    if (initialData._id !== "") {
      axios
        .patch(`/api/billboards/${params.billboardId}`, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          router.push(`/${params.storeId}/billboards`);
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
        .post(`/api/billboards/${params.storeId}`, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          router.push(`/${params.storeId}/billboards`);
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
      .delete(`/api/billboards/${params.billboardId}`)
      .then((res) => {
        router.push(`/${params.storeId}/billboards`);
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value != "" ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange()}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Billboard Label"
                      disabled={loading}
                      {...field}
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
