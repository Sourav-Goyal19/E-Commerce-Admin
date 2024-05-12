"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "./modal";
import { Button } from "@/components/ui/button";
import { useStoreModal } from "@/hooks/useStore";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useUser } from "@/zustand/store";

const StoreModal = () => {
  const { isOpen, onOpen, onClose } = useStoreModal();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const formObject = z.object({
    name: z.string().min(1, "Name is required"),
  });

  type formSchema = z.infer<typeof formObject>;

  const form = useForm<formSchema>({
    resolver: zodResolver(formObject),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: formSchema) => {
    setIsLoading(true);
    console.log(values);

    axios
      .post("/api/store", {
        name: values.name,
        userId: user?._id,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <Modal
        title="Create Store"
        description="Add a store to manage products and categories"
        isOpen={isOpen}
        onClose={onClose}
      >
        <div>
          <div className="py-2 space-y-2 pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E-Commerce"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-6 space-x-2 flex items-center justify-end">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoreModal;
