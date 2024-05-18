"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email(),
  });

  type FormFields = z.infer<typeof formSchema>;

  const form = useForm<FormFields>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/users/newtoken", data)
      .then((res) => {
        toast.success("Verification email sent");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-gray-950">
      <div className="max-w-md shadow w-full border rounded p-4">
        <h1 className="text-2xl font-bold text-center capitalize">
          Request a new Verification Email
        </h1>
        <Form {...form}>
          <form className="my-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button disabled={isLoading} type="submit" className="w-full mt-3">
              Send
            </Button>
          </form>
        </Form>
        <p className="text-center">
          <Link href="/" className="underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
