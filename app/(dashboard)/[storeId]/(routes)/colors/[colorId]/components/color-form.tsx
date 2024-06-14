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
import { ColorData } from "@/models/color.model";
import { ColorPicker } from "./color-picker";

interface ColorFormProps {
  initialData: ColorData;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z
    .string()
    .length(7, { message: "Color code must be of 6 digits" })
    .regex(/^#/, {
      message: "Value must be a valid hex color code",
    }),
});

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const title = initialData._id ? "Edit Color" : "Create Color";
  const description = initialData._id ? "Edit a color" : "Add a new color";
  const action = initialData._id ? "Save Changes" : "Create";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      value: initialData?.value || "#000000",
    },
  });

  const onSubmit = (data: ColorFormValues) => {
    setLoading(true);
    if (initialData._id == "") {
      axios
        .post(`/api/colors/${params.storeId}`, data)
        .then((res) => {
          router.push(`/${params.storeId}/colors`);
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
        .patch(`/api/colors/${params.colorId}`, data)
        .then((res) => {
          router.push(`/${params.storeId}/colors`);
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
      .delete(`/api/colors/${params.colorId}`)
      .then((res) => {
        router.push(`/${params.storeId}/colors`);
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Color Name"
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
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <ColorPicker
                      onChange={field.onChange}
                      value={field.value}
                      placeholder="Color Value (Start with #)"
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
