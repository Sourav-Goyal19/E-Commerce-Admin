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

  const schema = z.object({
    email: z.string().email(),
  });

  type FormField = z.infer<typeof schema>;

  const form = useForm<FormField>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormField> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/users/forgotpassword/generatetoken", data)
      .then((res) => {
        toast.success("Email sent successfully");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="h-screen flex justify-center items-center p-4">
      <div className="max-w-md shadow w-full border rounded p-4">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        <Form {...form}>
          <form className="my-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter Your Email"
                        type="email"
                        {...field}
                      />
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
