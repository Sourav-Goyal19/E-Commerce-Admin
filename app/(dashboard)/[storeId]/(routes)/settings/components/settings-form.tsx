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
import { ApiAlert } from "@/components/ui/api-alert";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useParams, useRouter } from "next/navigation";
import { StoreData } from "@/models/store.model";
import { useUser } from "@/zustand/store";
import { useOrigin } from "@/hooks/useOrigin";
import { Trash } from "lucide-react";

interface SettingsFormProps {
  initialData: StoreData;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type SettingFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: SettingFormValues) => {
    if (data.name == initialData.name) return toast.error("No changes made.");
    setLoading(true);
    axios
      .patch(`/api/store/${params.storeId}`, {
        name: data.name,
        userId: user?._id,
      })
      .then((res) => {
        router.refresh();
        window.location.reload();
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onDelete = () => {
    setLoading(true);
    axios
      .delete(`/api/store/${params.storeId}`)
      .then((res) => {
        router.push("/");
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
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
        <Heading title="Settings" description="Modify Store preferences" />
        <Button
          variant="destructive"
          size="icon"
          disabled={loading}
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Trash</span>
        </Button>
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
                      placeholder="Store name"
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
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="Public"
      />
    </>
  );
};
